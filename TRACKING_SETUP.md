# 🎯 CashKit Tracking Setup Guide

## ✅ **WHAT'S ALREADY IMPLEMENTED**

### **Facebook Pixel Events:**
- ✅ **PageView** - Automatically tracks when someone visits your landing page
- ✅ **ViewContent** - Tracks when users scroll 25%, 50%, 75%, 90% of page
- ✅ **InitiateCheckout** - Tracks when someone clicks any "Buy Now" button
- ✅ **Purchase** - Tracks successful payments on success page ($44.00 value)

### **Google Analytics 4 Events:**
- ✅ **page_view** - Landing page visits
- ✅ **scroll** - Engagement tracking at 25%, 50%, 75%, 90%
- ✅ **begin_checkout** - CTA button clicks
- ✅ **purchase** - Successful transactions with revenue tracking

---

## 🔧 **SETUP REQUIRED**

### **1. Get Your Facebook Pixel ID**
1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Navigate to **Events Manager**
3. Select your pixel or create a new one
4. Copy the Pixel ID (looks like: `1234567890123456`)

### **2. Get Your Google Analytics 4 ID**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Copy the Measurement ID (looks like: `G-XXXXXXXXXX`)

### **3. Update Your Website**
Replace these placeholders in your deployed site:

**In your landing page code:**
- Replace `YOUR_PIXEL_ID` with your Facebook Pixel ID
- Replace `YOUR_GA4_ID` with your Google Analytics Measurement ID

**Easy way to update:**
1. Go to your Vercel dashboard
2. Settings → Environment Variables
3. Add these variables:
   - `NEXT_PUBLIC_FB_PIXEL_ID` = your Facebook Pixel ID
   - `NEXT_PUBLIC_GA4_ID` = your Google Analytics Measurement ID

---

## 📊 **TRACKING VALIDATION**

### **Test Facebook Pixel:**
1. Install [Facebook Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Visit your landing page
3. Check that you see:
   - ✅ PageView event firing
   - ✅ ViewContent events as you scroll
   - ✅ InitiateCheckout when clicking CTA buttons
   - ✅ Purchase event on success page

### **Test Google Analytics:**
1. Go to GA4 → Reports → Realtime
2. Visit your landing page in another tab
3. Check that you see:
   - ✅ Active users on your page
   - ✅ Events firing (page_view, scroll, begin_checkout)

---

## 🎯 **META ADS OPTIMIZATION DATA**

### **Custom Audiences You Can Build:**
- **Website Visitors** (All visitors, 30-day, 7-day)
- **Page Scrollers** (25%, 50%, 75%, 90% engagement)
- **CTA Clickers** (People who clicked buy buttons)
- **Purchasers** (Your highest value audience)

### **Lookalike Audiences:**
- **1% Lookalike of Purchasers** (highest priority)
- **2% Lookalike of CTA Clickers**
- **5% Lookalike of High Engagers** (75%+ scroll)

### **Conversion Optimization:**
- **Purchase Event** - Optimize for completed sales
- **InitiateCheckout Event** - Optimize for CTA clicks
- **ViewContent Event** - Optimize for engaged visitors

---

## 💰 **REVENUE ATTRIBUTION**

### **What Gets Tracked:**
- **Product**: CashKit PLR Bundle
- **Price**: $44.00 USD
- **Transaction ID**: Unique per purchase
- **Category**: Digital Products
- **Item ID**: cashkit_plr_bundle

### **Meta Ads Reporting:**
- **ROAS** (Return on Ad Spend) will be calculated automatically
- **Cost Per Purchase** tracked in Ads Manager
- **Revenue Per Customer** visible in analytics
- **Conversion Rate** from ad click to purchase

---

## 🚀 **NEXT STEPS**

### **Immediate (This Week):**
1. **Get your Pixel ID and GA4 ID**
2. **Replace placeholder IDs** in your code
3. **Test tracking** with browser extensions
4. **Verify events** in Meta Events Manager

### **For Meta Ads Launch:**
1. **Build Custom Audiences** (need 100+ website visitors first)
2. **Create Lookalike Audiences** (need 100+ similar users)
3. **Set up Conversions API** for iOS 14.5+ tracking
4. **Configure UTM parameters** for campaign tracking

---

## 🔍 **TRACKING CHECKLIST**

- [ ] Facebook Pixel ID added to website
- [ ] Google Analytics 4 ID added to website
- [ ] PageView events firing correctly
- [ ] Scroll tracking working (ViewContent events)
- [ ] CTA clicks tracked (InitiateCheckout events)
- [ ] Purchase tracking working on success page
- [ ] Meta Events Manager showing data
- [ ] GA4 Realtime showing events
- [ ] Custom Audiences building in Meta
- [ ] Revenue attribution working

---

## 📞 **TROUBLESHOOTING**

### **Common Issues:**
- **Events not firing**: Check browser console for errors
- **Pixel not found**: Verify Pixel ID is correct
- **GA4 not tracking**: Confirm Measurement ID format
- **Purchase not tracking**: Test with mock checkout flow

### **Testing Tools:**
- [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
- Meta Events Manager Test Events
- GA4 DebugView

**Once tracking is set up correctly, you'll have all the data needed to optimize your Meta ads for maximum ROI!** 🎯
