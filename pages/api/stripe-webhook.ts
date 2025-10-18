/**
 * Stripe Webhook Handler
 * Listens for payment confirmations and sends Purchase event to Facebook
 */

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { trackPurchase } from '../../lib/facebook-conversions-api';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {}) : null;

// Stripe webhook secret (for signature verification)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Disable body parsing for webhook signature verification
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Read raw body from request
 */
async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe is configured
  if (!stripe || !stripeSecretKey) {
    console.warn('[Stripe Webhook] Stripe not configured - skipping webhook processing');
    return res.status(200).json({ received: true, message: 'Stripe not configured' });
  }

  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'] as string;

    // Verify webhook signature (only if webhook secret is configured)
    let event: Stripe.Event;
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err) {
        console.error('[Stripe Webhook] Signature verification failed:', err);
        return res.status(400).json({ error: 'Invalid signature' });
      }
    } else {
      // No signature verification (development mode)
      console.warn('[Stripe Webhook] No webhook secret - skipping signature verification');
      event = JSON.parse(rawBody.toString());
    }

    console.log('[Stripe Webhook] Event received:', {
      type: event.type,
      id: event.id,
    });

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('[Stripe Webhook] Checkout session completed:', {
        session_id: session.id,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
      });

      // Extract customer information
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;
      const [firstName, ...lastNameParts] = customerName?.split(' ') || [];
      const lastName = lastNameParts.join(' ');

      // Extract address information
      const address = session.customer_details?.address;

      // Extract metadata (we'll store event_id, fbc, fbp here from checkout creation)
      const metadata = session.metadata || {};
      const eventId = metadata.event_id || `CASHKIT_${Date.now()}`;
      const fbc = metadata.fbc;
      const fbp = metadata.fbp;
      const clientIp = metadata.client_ip;
      const clientUserAgent = metadata.client_user_agent;

      // Send Purchase event to Facebook Conversions API
      const fbResult = await trackPurchase({
        transaction_id: eventId,
        event_source_url: metadata.success_url || 'https://cashkit.vercel.app/success',
        customer_email: customerEmail || undefined,
        customer_first_name: firstName || undefined,
        customer_last_name: lastName || undefined,
        customer_city: address?.city || undefined,
        customer_state: address?.state || undefined,
        customer_zip: address?.postal_code || undefined,
        customer_country: address?.country || undefined,
        client_ip: clientIp || undefined,
        client_user_agent: clientUserAgent || undefined,
        fbc: fbc || undefined,
        fbp: fbp || undefined,
      });

      console.log('[Stripe Webhook] Facebook Purchase event result:', fbResult);

      // Optionally: Send AddPaymentInfo event as well (combined with Purchase)
      // Since we can't track when payment info is added on Stripe's page,
      // we send it here after successful payment

      return res.status(200).json({
        received: true,
        facebook_event_sent: fbResult.success,
        session_id: session.id,
      });
    }

    // Handle payment_intent.succeeded event (alternative)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      console.log('[Stripe Webhook] Payment intent succeeded:', {
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
      });

      // You can also track Purchase here if you prefer payment_intent over checkout.session
      // For now, we'll use checkout.session.completed as primary
    }

    // Return success for all webhook events
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Stripe Webhook] Error processing webhook:', err);
    return res.status(500).json({
      error: 'Webhook processing failed',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

