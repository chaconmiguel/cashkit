# 🔧 Stripe Sandbox Setup Instructions

## Quick Setup (2 minutes)

### 1. Create `.env.local` file in the project root:

```bash
# Create the file
touch .env.local
```

### 2. Add your Stripe keys to `.env.local`:

```env
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here

# Optional: Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Get Your Stripe Test Keys:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in top left)
3. Copy your:
   - **Secret key** (starts with `sk_test_...`) 
   - **Publishable key** (starts with `pk_test_...`)

### 4. Test the Checkout:

1. Restart your dev server: `npm run dev`
2. Click any "Buy Now" button on the landing page
3. Use test card: `4242 4242 4242 4242`
4. Any future date for expiry
5. Any 3-digit CVC

## ✅ What's Already Configured:

- ✅ Stripe checkout API (`/api/create-checkout-session`)
- ✅ Success page (`/success`)
- ✅ Cancel page (`/cancel`) 
- ✅ Error handling
- ✅ Loading states on all buttons
- ✅ Product price: $47 USD
- ✅ Secure redirect flow

## 🧪 Test Cards:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |

## 🚀 Going Live:

1. Switch to **Live mode** in Stripe Dashboard
2. Replace `sk_test_` and `pk_test_` with live keys
3. Update success/cancel URLs if needed
4. Test with real card (small amount)

## 📞 Support:

If you have issues:
- Check browser console for errors
- Verify `.env.local` file exists and has correct keys
- Make sure dev server restarted after adding keys
- Test with different browsers/incognito mode

**Your checkout is ready to go! 🎉**
