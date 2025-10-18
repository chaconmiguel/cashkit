/**
 * API endpoint to track InitiateCheckout event
 * Called when user clicks "Buy Now" button
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { trackInitiateCheckout, extractFbc, extractFbp } from '../../lib/facebook-conversions-api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event_id, event_source_url } = req.body;

    // Get user information from request
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

    console.log('[InitiateCheckout API] Tracking event:', {
      event_id,
      client_ip: clientIp,
      has_user_agent: !!clientUserAgent,
      has_fbc: !!fbc,
      has_fbp: !!fbp,
    });

    // Send to Facebook Conversions API
    const result = await trackInitiateCheckout({
      event_id: event_id || `checkout_${Date.now()}`,
      event_source_url: event_source_url || referer,
      client_ip: clientIp,
      client_user_agent: clientUserAgent,
      fbc,
      fbp,
    });

    return res.status(200).json({
      success: result.success,
      message: result.message,
      event_id: event_id,
    });
  } catch (err) {
    console.error('[InitiateCheckout API] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to track event',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

