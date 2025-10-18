# 🔐 Setup Environment Variables for Meta Conversions API

## Step 1: Add Environment Variables to Vercel

1. Go to: https://vercel.com/chaconmiguels-projects/cashkit-landing
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar
4. Add the following 3 variables:

---

### Variable 1: Facebook Conversions API Token

```
Name: FB_CAPI_TOKEN
Value: EAASxy4ioaA4BPtW9MFbOOVkZAXjVK3A8Pe6pM0ya7fMbqSUgXLetPTjuPj3cz5ZBvPqy4HCICPa2OY4vrfQAMO6Ox6uHGZAuHI5Iq2qVlPOCCgtgqzLQ4aTKJdbgC0ay70dLT8gAEY7Bi17OYiHLmVcRxeZBZCRJ5194Eb7Vn2nKj01z3B0nKcdIZCd9UjqwZDZD
Environments: ☑️ Production ☑️ Preview ☑️ Development
```

**Click "Save"**

---

### Variable 2: Facebook Pixel ID

```
Name: NEXT_PUBLIC_FB_PIXEL_ID
Value: 4078333462420336
Environments: ☑️ Production ☑️ Preview ☑️ Development
```

**Click "Save"**

---

### Variable 3: Facebook API Version

```
Name: FB_API_VERSION
Value: v21.0
Environments: ☑️ Production ☑️ Preview ☑️ Development
```

**Click "Save"**

---

## Step 2: Setup Stripe Webhook (IMPORTANT!)

For the Purchase event to work, you need to configure a Stripe webhook.

### 2.1 Get Your Webhook URL

Your webhook URL is:
```
https://cashkit-landing-[YOUR-VERCEL-URL].vercel.app/api/stripe-webhook
```

Example:
```
https://cashkit-landing-git-main-chaconmiguels-projects.vercel.app/api/stripe-webhook
```

### 2.2 Add Webhook to Stripe Dashboard

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Paste your webhook URL
4. Click **"Select events"**
5. Check: ☑️ `checkout.session.completed`
6. Click **"Add endpoint"**

### 2.3 Get Webhook Signing Secret

After creating the webhook:
1. Click on the webhook you just created
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_...`)

### 2.4 Add Webhook Secret to Vercel

Go back to Vercel Environment Variables and add:

```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_[your_webhook_signing_secret]
Environments: ☑️ Production ☑️ Preview ☑️ Development
```

**Click "Save"**

---

## Step 3: Redeploy Your Site

After adding all environment variables:

1. Go to your Vercel project dashboard
2. Click **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**

Or run from terminal:
```bash
vercel --prod
```

---

## Step 4: Test Your Setup

### 4.1 Test InitiateCheckout Event

1. Visit your live site
2. Click "BUY NOW" button
3. Go to: https://business.facebook.com/events_manager
4. Click on your Pixel
5. Click **"Test Events"** tab
6. You should see:
   - ✅ `InitiateCheckout` event (from Pixel)
   - ✅ `InitiateCheckout` event (from Server)
   - Both with same `event_id` = deduplicated!

### 4.2 Test Purchase Event

1. Complete a test purchase (use Stripe test card: `4242 4242 4242 4242`)
2. Go to: https://business.facebook.com/events_manager
3. You should see:
   - ✅ `Purchase` event (from Pixel on success page)
   - ✅ `Purchase` event (from Server via webhook)
   - Both with same `transaction_id` = deduplicated!

### 4.3 Check Event Match Quality

1. Go to Events Manager
2. Click on **"Purchase"** event
3. Click **"Event Match Quality"** tab
4. You should see **"Good"** or **"Great"** score
5. Parameters matched:
   - ✅ event_id
   - ✅ em (email)
   - ✅ client_ip_address
   - ✅ client_user_agent
   - ✅ fbc (if from Facebook ad)
   - ✅ fbp (Facebook browser cookie)

---

## Troubleshooting

### No Events Showing Up?

**Check:**
1. Environment variables are saved in Vercel
2. You redeployed after adding variables
3. Your Pixel ID is correct: `4078333462420336`
4. Your CAPI token is correct (starts with `EAASxy4...`)

**View Logs:**
```bash
vercel logs --follow
```

### Webhook Not Receiving Events?

**Check:**
1. Webhook URL is correct in Stripe dashboard
2. `STRIPE_WEBHOOK_SECRET` is added to Vercel
3. Event type `checkout.session.completed` is selected in Stripe

**Test Webhook:**
1. Go to Stripe Dashboard → Webhooks
2. Click your webhook
3. Click "Send test webhook"
4. Check if it shows "Succeeded"

### Event Match Quality is "Poor"?

**Improve by adding more parameters:**
- Customer email (automatically captured from Stripe)
- Facebook click ID (automatically captured if coming from ad)
- Facebook browser cookie (automatically captured)
- IP address (automatically captured)

All of these are already implemented! Just make sure webhooks are working.

---

## Environment Variables Summary

Here's what you need in Vercel:

| Variable Name | Value | Purpose |
|--------------|-------|---------|
| `FB_CAPI_TOKEN` | `EAASxy4ioaA4BP...` | Facebook Conversions API access token |
| `NEXT_PUBLIC_FB_PIXEL_ID` | `4078333462420336` | Your Facebook Pixel ID |
| `FB_API_VERSION` | `v21.0` | Facebook Graph API version |
| `STRIPE_SECRET_KEY` | `sk_...` | Stripe secret key (already added) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_...` | Stripe publishable key (already added) |

---

## What's Tracking Now?

### ✅ Browser-Side (Pixel):
- PageView (when page loads)
- ViewContent (when scrolling 25%, 50%, 75%, 90%)
- InitiateCheckout (when clicking "Buy Now")
- Purchase (on success page)

### ✅ Server-Side (Conversions API):
- InitiateCheckout (when clicking "Buy Now")
- Purchase (via Stripe webhook)

### 🎯 Deduplication:
- Same `event_id` for InitiateCheckout (browser + server)
- Same `transaction_id` for Purchase (browser + server)
- Facebook automatically deduplicates = accurate counting!

---

## Next Steps

Once everything is working:

1. ✅ Run test purchases to verify events
2. ✅ Check Event Match Quality is "Good" or "Great"
3. ✅ Create your first Meta ad campaign
4. ✅ Target warm audiences (website visitors, video viewers)
5. ✅ Use "Conversions" objective
6. ✅ Optimize for "Purchase" event
7. ✅ Watch the sales roll in! 🚀

---

## Need Help?

If events aren't showing up or you get errors, check:

1. **Vercel Logs**: `vercel logs --follow`
2. **Browser Console**: Press F12 → Console tab
3. **Facebook Events Manager**: Test Events tab
4. **Stripe Webhook Logs**: Dashboard → Webhooks → Click your webhook → View logs

All set! Your Meta Conversions API is now fully integrated! 🎉

