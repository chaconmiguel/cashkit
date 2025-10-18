/**
 * Facebook Conversions API (CAPI) Integration
 * Sends server-side events to Facebook for better tracking accuracy
 */

import { hashEmail } from './crypto-utils';

// Facebook Conversions API configuration
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '4078333462420336';
const FB_CAPI_TOKEN = process.env.FB_CAPI_TOKEN || '';
const FB_API_VERSION = process.env.FB_API_VERSION || 'v21.0';

interface UserData {
  em?: string;              // Email (will be hashed)
  ph?: string;              // Phone (will be hashed)
  fn?: string;              // First name (will be hashed)
  ln?: string;              // Last name (will be hashed)
  ct?: string;              // City (will be hashed)
  st?: string;              // State (will be hashed)
  zp?: string;              // Zip/Postal code (will be hashed)
  country?: string;         // Country code (will be hashed)
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string;             // Facebook click ID (from URL)
  fbp?: string;             // Facebook browser ID (from cookie)
}

interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  [key: string]: any;
}

interface FacebookEvent {
  event_name: string;
  event_time: number;
  event_id?: string;
  event_source_url: string;
  action_source: 'website';
  user_data: UserData;
  custom_data?: CustomData;
}

interface FacebookEventRequest {
  data: FacebookEvent[];
  test_event_code?: string;
}

/**
 * Send event to Facebook Conversions API
 */
export async function sendFacebookEvent(
  eventName: string,
  eventData: {
    event_id?: string;
    event_source_url: string;
    user_data: {
      email?: string;
      phone?: string;
      first_name?: string;
      last_name?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      client_ip_address?: string;
      client_user_agent?: string;
      fbc?: string;
      fbp?: string;
    };
    custom_data?: CustomData;
    test_event_code?: string;
  }
): Promise<{ success: boolean; message?: string; facebook_response?: any }> {
  // Skip if no token configured
  if (!FB_CAPI_TOKEN) {
    console.warn('[FB CAPI] No access token configured - skipping event:', eventName);
    return { success: false, message: 'No FB_CAPI_TOKEN configured' };
  }

  try {
    // Hash user data according to Facebook requirements
    const hashedUserData: UserData = {
      client_ip_address: eventData.user_data.client_ip_address,
      client_user_agent: eventData.user_data.client_user_agent,
      fbc: eventData.user_data.fbc,
      fbp: eventData.user_data.fbp,
    };

    // Hash email if provided
    if (eventData.user_data.email) {
      hashedUserData.em = hashEmail(eventData.user_data.email);
    }

    // Hash other fields if provided (Facebook requires hashing for PII)
    if (eventData.user_data.phone) {
      hashedUserData.ph = hashEmail(eventData.user_data.phone); // Using same hash function
    }
    if (eventData.user_data.first_name) {
      hashedUserData.fn = hashEmail(eventData.user_data.first_name);
    }
    if (eventData.user_data.last_name) {
      hashedUserData.ln = hashEmail(eventData.user_data.last_name);
    }
    if (eventData.user_data.city) {
      hashedUserData.ct = hashEmail(eventData.user_data.city);
    }
    if (eventData.user_data.state) {
      hashedUserData.st = hashEmail(eventData.user_data.state);
    }
    if (eventData.user_data.zip) {
      hashedUserData.zp = hashEmail(eventData.user_data.zip);
    }
    if (eventData.user_data.country) {
      hashedUserData.country = hashEmail(eventData.user_data.country);
    }

    // Build event payload
    const event: FacebookEvent = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000), // Unix timestamp
      event_id: eventData.event_id,
      event_source_url: eventData.event_source_url,
      action_source: 'website',
      user_data: hashedUserData,
      custom_data: eventData.custom_data,
    };

    const payload: FacebookEventRequest = {
      data: [event],
    };

    // Add test event code if provided (for testing in Events Manager)
    if (eventData.test_event_code) {
      payload.test_event_code = eventData.test_event_code;
    }

    // Send to Facebook Conversions API
    const url = `https://graph.facebook.com/${FB_API_VERSION}/${FB_PIXEL_ID}/events?access_token=${FB_CAPI_TOKEN}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[FB CAPI] Error sending event:', {
        status: response.status,
        error: result,
        event_name: eventName,
      });
      return {
        success: false,
        message: result.error?.message || 'Facebook API error',
        facebook_response: result,
      };
    }

    console.log('[FB CAPI] Event sent successfully:', {
      event_name: eventName,
      event_id: eventData.event_id,
      events_received: result.events_received,
      fbtrace_id: result.fbtrace_id,
    });

    return {
      success: true,
      message: 'Event sent successfully',
      facebook_response: result,
    };
  } catch (error) {
    console.error('[FB CAPI] Exception sending event:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Helper: Send InitiateCheckout event
 */
export async function trackInitiateCheckout(data: {
  event_id: string;
  event_source_url: string;
  client_ip?: string;
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
}) {
  return sendFacebookEvent('InitiateCheckout', {
    event_id: data.event_id,
    event_source_url: data.event_source_url,
    user_data: {
      client_ip_address: data.client_ip,
      client_user_agent: data.client_user_agent,
      fbc: data.fbc,
      fbp: data.fbp,
    },
    custom_data: {
      value: 44.0,
      currency: 'USD',
      content_name: 'CashKit PLR Bundle',
      content_category: 'Digital Products',
      content_ids: ['cashkit_plr_bundle'],
      content_type: 'product',
      num_items: 1,
    },
  });
}

/**
 * Helper: Send Purchase event
 */
export async function trackPurchase(data: {
  transaction_id: string;
  event_source_url: string;
  customer_email?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_city?: string;
  customer_state?: string;
  customer_zip?: string;
  customer_country?: string;
  client_ip?: string;
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
  test_event_code?: string;
}) {
  return sendFacebookEvent('Purchase', {
    event_id: data.transaction_id, // Use transaction_id as event_id for deduplication
    event_source_url: data.event_source_url,
    user_data: {
      email: data.customer_email,
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      city: data.customer_city,
      state: data.customer_state,
      zip: data.customer_zip,
      country: data.customer_country,
      client_ip_address: data.client_ip,
      client_user_agent: data.client_user_agent,
      fbc: data.fbc,
      fbp: data.fbp,
    },
    custom_data: {
      value: 44.0,
      currency: 'USD',
      content_name: 'CashKit PLR Bundle',
      content_category: 'Digital Products',
      content_ids: ['cashkit_plr_bundle'],
      content_type: 'product',
      num_items: 1,
    },
    test_event_code: data.test_event_code,
  });
}

/**
 * Extract Facebook click ID (fbc) from URL parameters
 */
export function extractFbc(url: string): string | undefined {
  try {
    const urlObj = new URL(url);
    const fbclid = urlObj.searchParams.get('fbclid');
    if (fbclid) {
      // Format: fb.1.[subdomainIndex].[creationTime].[fbclid]
      return `fb.1.${Date.now()}.${fbclid}`;
    }
  } catch (e) {
    console.error('[FB CAPI] Error extracting fbc:', e);
  }
  return undefined;
}

/**
 * Extract Facebook browser ID (fbp) from cookies
 */
export function extractFbp(cookies: string): string | undefined {
  try {
    const match = cookies.match(/_fbp=([^;]+)/);
    return match ? match[1] : undefined;
  } catch (e) {
    console.error('[FB CAPI] Error extracting fbp:', e);
  }
  return undefined;
}

