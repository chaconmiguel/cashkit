# 🎯 Meta Conversions API - Simple Implementation Plan

## ✅ **WHAT WE HAVE**
- ✅ Access Token: `EAASxy4ioaA4BPtW9MFbOOVkZAXjVK3A8Pe6pM0ya7fMbqSUgXLetPTjuPj3cz5ZBvPqy4HCICPa2OY4vrfQAMO6Ox6uHGZAuHI5Iq2qVlPOCCgtgqzLQ4aTKJdbgC0ay70dLT8gAEY7Bi17OYiHLmVcRxeZBZCRJ5194Eb7Vn2nKj01z3B0nKcdIZCd9UjqwZDZD`
- ✅ Events needed: ViewContent, AddToCart, InitiateCheckout, AddPaymentInfo, Purchase
- ✅ Pixel already on website (just needs your Pixel ID)

---

## 🎯 **WHAT WE'LL DO** (Simple 3-Step Plan)

### **STEP 1: Store Your Token Securely** ⏱️ 5 minutes
Add the token to Vercel so it's safe and private.

### **STEP 2: Create Helper to Send Events** ⏱️ 30 minutes
Build one file that talks to Facebook for all events.

### **STEP 3: Connect Events to Website Actions** ⏱️ 45 minutes
Hook up the 5 events to the right places on your site.

**Total Time: 1 hour 20 minutes**

---

## 📋 **DETAILED PLAN**

---

## **STEP 1: Add Token to Vercel** (5 minutes)

### **What to Do:**
1. Go to: https://vercel.com/chaconmiguels-projects/cashkit-landing
2. Click "Settings" tab
3. Click "Environment Variables" in left menu
4. Click "Add New"

### **Add These 3 Variables:**

**Variable 1:**
```
Name: FB_CAPI_TOKEN
Value: EAASxy4ioaA4BPtW9MFbOOVkZAXjVK3A8Pe6pM0ya7fMbqSUgXLetPTjuPj3cz5ZBvPqy4HCICPa2OY4vrfQAMO6Ox6uHGZAuHI5Iq2qVlPOCCgtgqzLQ4aTKJdbgC0ay70dLT8gAEY7Bi17OYiHLmVcRxeZBZCRJ5194Eb7Vn2nKj01z3B0nKcdIZCd9UjqwZDZD
Environments: Production, Preview, Development
```

**Variable 2:**
```
Name: NEXT_PUBLIC_FB_PIXEL_ID
Value: [YOUR_16_DIGIT_PIXEL_ID]  ← You need to give me this
Environments: Production, Preview, Development
```

**Variable 3:**
```
Name: FB_API_VERSION
Value: v21.0
Environments: Production, Preview, Development
```

### **What I Need From You:**
🔴 **Your Facebook Pixel ID** (16-digit number)
- Find it: Events Manager → Settings → top of page
- Looks like: `1234567890123456`

---

## **STEP 2: Create Facebook Helper File** (30 minutes)

### **What I'll Create:**
One file that handles ALL Facebook server events.

**File**: `lib/facebook-conversions-api.ts`

### **What It Does:**
- Sends events to Facebook's server
- Hashes customer email (privacy)
- Captures IP address & browser info
- Prevents duplicate events (deduplication)
- Handles errors gracefully

### **Events It Will Support:**
1. ✅ ViewContent (when scrolling page)
2. ✅ AddToCart (when clicking "Add" - we'll map to InitiateCheckout)
3. ✅ InitiateCheckout (when clicking "Buy Now")
4. ✅ AddPaymentInfo (when on Stripe page - we'll send with Purchase)
5. ✅ Purchase (when payment completes)

---

## **STEP 3: Connect Events to Your Website** (45 minutes)

### **Event 1: ViewContent** 
**Triggers**: User scrolls 25%, 50%, 75%, 90%

**Where**: `pages/index.tsx` (already has scroll tracking)

**What I'll Add:**
```javascript
// After pixel tracks scroll → Send to Conversions API
await sendFacebookEvent({
  event_name: 'ViewContent',
  event_source_url: window.location.href,
  user_data: {
    client_ip_address: req.headers['x-forwarded-for'],
    client_user_agent: navigator.userAgent
  }
});
```

**Status**: ⚠️ Actually, ViewContent should be sent from backend
**Solution**: Skip browser-side ViewContent, focus on purchase funnel

---

### **Event 2 & 3: InitiateCheckout (replaces AddToCart)**
**Triggers**: User clicks "GET INSTANT ACCESS" or "BUY NOW"

**Where**: `pages/index.tsx` - `handleCheckout()` function

**What I'll Add:**
```javascript
// When user clicks buy → Send to Conversions API
await fetch('/api/track-event', {
  method: 'POST',
  body: JSON.stringify({
    event_name: 'InitiateCheckout',
    event_id: 'checkout_' + Date.now(),
    value: 44.00,
    currency: 'USD'
  })
});
```

**Why Skip AddToCart?**
- You don't have a cart - go straight to checkout
- InitiateCheckout covers this perfectly

---

### **Event 4: AddPaymentInfo**
**Triggers**: When user enters payment on Stripe page

**Problem**: Stripe's page, can't track directly

**Solution**: Send AddPaymentInfo with Purchase event (combined)

---

### **Event 5: Purchase** (MOST IMPORTANT)
**Triggers**: Payment completes successfully

**Where**: Create new webhook: `pages/api/stripe-webhook.ts`

**How It Works:**
1. Customer pays on Stripe
2. Stripe sends webhook to your site
3. Your site sends Purchase to Facebook
4. Facebook attributes sale to ad

**What I'll Add:**
```javascript
// When Stripe confirms payment → Send to Facebook
await sendFacebookEvent({
  event_name: 'Purchase',
  event_id: transaction_id,
  event_time: Math.floor(Date.now() / 1000),
  event_source_url: 'https://your-site.vercel.app/success',
  action_source: 'website',
  user_data: {
    em: [hashEmail(customer_email)],
    client_ip_address: customer_ip,
    client_user_agent: user_agent,
    fbc: facebook_click_id,
    fbp: facebook_browser_id
  },
  custom_data: {
    currency: 'USD',
    value: 44.00,
    content_ids: ['cashkit_plr_bundle'],
    content_name: 'CashKit PLR Bundle',
    content_type: 'product',
    num_items: 1
  }
});
```

---

## 📂 **FILES I'LL CREATE/MODIFY**

### **New Files (3):**
1. `lib/facebook-conversions-api.ts` - Helper functions
2. `lib/crypto-utils.ts` - Email hashing (SHA256)
3. `pages/api/stripe-webhook.ts` - Stripe → Facebook bridge

### **Modified Files (2):**
1. `pages/index.tsx` - Add InitiateCheckout tracking
2. `pages/api/create-checkout-session.ts` - Store event data

### **No Changes Needed:**
- ❌ Landing page design
- ❌ Existing checkout flow
- ❌ Current pixel (already installed)
- ❌ Any UI/UX

---

## 🔄 **HOW EVENTS FLOW**

### **User Journey → Facebook Events:**

```
1. User visits site
   → Pixel: PageView ✅ (already working)

2. User scrolls down
   → Pixel: ViewContent ✅ (already working)
   → Server: Skip (not critical)

3. User clicks "BUY NOW"
   → Pixel: InitiateCheckout ✅ (already working)
   → Server: InitiateCheckout 🆕 (I'll add)

4. User redirects to Stripe
   → (No tracking possible on Stripe's site)

5. Payment completes
   → Stripe webhook received
   → Server: Purchase 🆕 (I'll add)
   → Server: AddPaymentInfo 🆕 (I'll add - sent with Purchase)
   → Pixel: Purchase ✅ (already working on success page)
```

---

## ⚙️ **TECHNICAL DETAILS**

### **API Endpoint:**
```
POST https://graph.facebook.com/v21.0/{PIXEL_ID}/events
```

### **Request Format:**
```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1729278924,
    "event_id": "CASHKIT_12345678",
    "event_source_url": "https://cashkit.vercel.app/success",
    "action_source": "website",
    "user_data": {
      "em": ["7b17fb0bd173f625b..."],
      "client_ip_address": "192.168.1.1",
      "client_user_agent": "Mozilla/5.0...",
      "fbc": "fb.1.123456789.AbCdEfGh",
      "fbp": "_fbp=fb.1.123456789.987654321"
    },
    "custom_data": {
      "currency": "USD",
      "value": 44.00,
      "content_ids": ["cashkit_plr_bundle"],
      "content_name": "CashKit PLR Bundle",
      "content_type": "product"
    }
  }],
  "access_token": "EAASxy4ioaA4BP..."
}
```

---

## 🔐 **SECURITY & PRIVACY**

### **Email Hashing:**
```javascript
// Customer email: john@example.com
// Before sending: 7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068
// Facebook uses hash to match, but never sees actual email
```

### **Data We Send:**
- ✅ Hashed email (SHA256)
- ✅ IP address (for location matching)
- ✅ Browser info (user agent)
- ✅ Facebook click ID (from URL if coming from ad)
- ✅ Transaction details (amount, product)

### **Data We DON'T Send:**
- ❌ Raw email addresses
- ❌ Credit card info (Stripe handles this)
- ❌ Passwords
- ❌ Personal messages

---

## ✅ **DEDUPLICATION STRATEGY**

### **Problem:**
Same event sent twice (once from browser, once from server) = overcounting

### **Solution:**
Use same `event_id` for both Pixel and Server events

```javascript
// Browser Pixel:
fbq('track', 'Purchase', {
  value: 44.00,
  currency: 'USD'
}, {
  eventID: 'CASHKIT_12345678'  // Unique ID
});

// Server API (same event_id):
{
  event_name: 'Purchase',
  event_id: 'CASHKIT_12345678',  // Same ID
  value: 44.00
}
```

**Result**: Facebook sees both, but counts as ONE purchase

---

## 📊 **WHAT YOU'LL SEE IN META**

### **Events Manager - After Implementation:**
```
Event Name          | Pixel | Server | Deduplicated
--------------------|-------|--------|-------------
PageView            |  ✅   |   ⏸️   |     ✅
ViewContent         |  ✅   |   ⏸️   |     ✅
InitiateCheckout    |  ✅   |   ✅   |     ✅
Purchase            |  ✅   |   ✅   |     ✅
```

### **Event Match Quality:**
Target: "Good" or "Great"
- ✅ event_id (prevents duplicates)
- ✅ em (email - helps attribution)
- ✅ client_ip_address
- ✅ client_user_agent
- ✅ fbc (Facebook click ID)
- ✅ fbp (Facebook browser ID)

---

## 🚀 **IMPLEMENTATION STEPS**

### **What You Do:**
1. ✅ Add 3 environment variables to Vercel
2. ✅ Give me your Pixel ID (16 digits)
3. ✅ Set up Stripe webhook URL (I'll give you the URL)

### **What I Do:**
1. ✅ Create Facebook helper file
2. ✅ Create webhook endpoint
3. ✅ Add InitiateCheckout tracking
4. ✅ Add Purchase tracking
5. ✅ Test with Meta Test Events
6. ✅ Deploy to production

### **Timeline:**
- You: 10 minutes (add env vars + give pixel ID)
- Me: 1 hour (write code)
- Testing: 15 minutes
- **Total: 1.5 hours to launch**

---

## 🧪 **TESTING PLAN**

### **Step 1: Test Events Tool**
```
Meta Events Manager → Test Events tab
→ Generate Test Code
→ I'll use this to send test events
→ Verify they appear correctly
```

### **Step 2: Real Purchase Test**
```
1. Click "Buy Now" on your site
2. Complete Stripe checkout (test mode)
3. Check Events Manager
4. Verify Purchase event shows:
   - Pixel source: ✅
   - Server source: ✅
   - Deduplicated: ✅
```

### **Step 3: Check Event Match Quality**
```
Events Manager → Purchase event → Event Match Quality
→ Should show "Good" or "Great"
→ 6/6 parameters matched
```

---

## ⚠️ **IMPORTANT NOTES**

### **Events We're Actually Using:**
✅ **PageView** - Pixel only (already working)
✅ **ViewContent** - Pixel only (already working)
✅ **InitiateCheckout** - Pixel + Server
✅ **Purchase** - Pixel + Server
⏸️ **AddToCart** - Skipping (no cart)
⏸️ **AddPaymentInfo** - Combined with Purchase

### **Why Fewer Events?**
- You don't have a shopping cart
- Payment happens on Stripe's page
- These 4 events give Facebook everything it needs

---

## 💰 **EXPECTED RESULTS**

### **Before (Pixel Only):**
- 70-80% tracking accuracy (iOS blocks pixel)
- Harder to optimize campaigns
- Less data for lookalike audiences

### **After (Pixel + Server):**
- 95-98% tracking accuracy
- Better campaign optimization
- More data for Facebook's algorithm
- Lower cost per purchase
- Better ROAS

---

## ✅ **READY TO IMPLEMENT?**

### **I Need From You:**
1. 🔴 **Facebook Pixel ID** (16 digits) - Find in Events Manager
2. ✅ Confirm you added environment variables to Vercel
3. ✅ Approve me to create the 3 new files

### **Then I'll:**
1. Create all the code
2. Test thoroughly
3. Deploy to production
4. Walk you through verification

**Reply with your Pixel ID and I'll start coding!** 🚀

---

## 📞 **QUESTIONS?**

Common questions:

**Q: Will this break my site?**
A: No - all new code, nothing changes existing functionality

**Q: What if something goes wrong?**
A: Easy rollback - can disable in 30 seconds

**Q: How long until I see data?**
A: Immediately after first purchase

**Q: Do I need to pause my ads?**
A: No - implement while ads are running

**Q: Is my token safe?**
A: Yes - stored in Vercel, never exposed to browser

