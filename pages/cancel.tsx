import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Cancel() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create checkout session");
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "No checkout URL returned");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong, please try again.";
      console.error("Checkout error:", message);
      setCheckoutLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>Payment Cancelled - CashKit</title>
        <meta name="description" content="Your payment was cancelled. You can try again anytime." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="cancel-page">
        <div className="cancel-container">
          {/* Cancel Icon */}
          <div className="cancel-icon">
            <div className="cancel-x">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="cancel-title">
            Payment Cancelled
          </h1>
          
          <p className="cancel-subtitle">
            No worries! Your payment was cancelled and you haven't been charged.
          </p>

          {/* Why People Cancel */}
          <div className="cancel-features">
            <h2>Need more information?</h2>
            
            <div className="cancel-features-list">
              <div className="cancel-feature">
                <span className="cancel-check">✓</span>
                <span>1,000+ PLR digital products with full resale rights</span>
              </div>
              <div className="cancel-feature">
                <span className="cancel-check">✓</span>
                <span>30,000+ creator assets (videos, captions, hooks)</span>
              </div>
              <div className="cancel-feature">
                <span className="cancel-check">✓</span>
                <span>Complete setup guides for Shopify, Gumroad & Etsy</span>
              </div>
              <div className="cancel-feature">
                <span className="cancel-check">✓</span>
                <span>7-day action plan to launch your first product</span>
              </div>
              <div className="cancel-feature">
                <span className="cancel-check">✓</span>
                <span>14-day money-back guarantee</span>
              </div>
              <div className="cancel-feature">
                <span className="cancel-check">✓</span>
                <span>One-time payment, lifetime access</span>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="cancel-security">
            <h3>🔒 Secure Payment</h3>
            <p>
              All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="cancel-buttons">
            <button 
              className="btn btn-primary btn-large" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "TRY AGAIN - GET CASHKIT"} <span className="bounce-arrow">→</span>
            </button>
            <Link href="/landing#faq" className="btn btn-secondary">
              View FAQ
            </Link>
          </div>

          {/* Contact Support */}
          <div className="cancel-support">
            <p>
              Still have questions? We're here to help!
            </p>
            <div className="cancel-support-links">
              <a 
                href="mailto:support@cashkit.com" 
                className="cancel-link"
              >
                📧 support@cashkit.com
              </a>
              <Link href="/landing#faq" className="cancel-link">
                📚 Browse FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}