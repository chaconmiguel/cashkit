import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { extractFbc, extractFbp } from "../../lib/facebook-conversions-api";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Extract tracking data from request
    const { event_id, event_source_url } = req.body;
    
    // Get user information for Facebook tracking
    const clientIp = 
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      undefined;
    
    const clientUserAgent = req.headers['user-agent'] || undefined;
    const cookies = req.headers.cookie || '';
    const referer = req.headers.referer || event_source_url || '';
    
    // Extract Facebook tracking IDs
    const fbc = extractFbc(referer);
    const fbp = extractFbp(cookies);
    
    const origin = req.headers.origin || "http://localhost:3000";
    const generatedEventId = event_id || `CASHKIT_${Date.now()}`;

    // For development without Stripe keys, return a mock success
    if (!stripeSecretKey || stripeSecretKey.length < 10) {
      console.log("⚠️  No Stripe key configured - using development mock");
      // Simulate a delay like real Stripe
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(200).json({ 
        url: `${origin}/success?mock=true` 
      });
    }

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "CashKit PLR Bundle",
              description: "1,000+ PLR PDFs + 30,000+ Creator Assets"
            },
            unit_amount: 4400,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        product: "cashkit_plr_bundle",
        event_id: generatedEventId,
        fbc: fbc || '',
        fbp: fbp || '',
        client_ip: clientIp || '',
        client_user_agent: clientUserAgent || '',
        success_url: `${origin}/success`,
      }
    });

    return res.status(200).json({ url: session.url, event_id: generatedEventId });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Stripe checkout failed";
    return res.status(500).json({ error: message });
  }
}


