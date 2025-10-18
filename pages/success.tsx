import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Success() {
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    // Generate transaction ID on client side only
    const id = 'CASHKIT_' + Date.now().toString().slice(-8);
    setTransactionId(id);

    // Track Facebook Pixel Purchase event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: 44.00,
        currency: 'USD',
        transaction_id: id,
        content_name: 'CashKit PLR Bundle',
        content_category: 'Digital Products',
        content_ids: ['cashkit_plr_bundle'],
        content_type: 'product',
        num_items: 1
      });
    }

    // Track Google Analytics purchase event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: id,
        value: 44.00,
        currency: 'USD',
        items: [{
          item_id: 'cashkit_plr_bundle',
          item_name: 'CashKit PLR Bundle',
          category: 'Digital Products',
          quantity: 1,
          price: 44.00
        }]
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Thank You! - CashKit Purchase Successful</title>
        <meta name="description" content="Thank you for your CashKit purchase! Check your email for download instructions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="success-page">
        <div className="success-container">
          {/* Success Icon */}
          <div className="success-icon">
            <div className="success-checkmark">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="success-title">
            🎉 Payment Successful!
          </h1>
          
          <p className="success-subtitle">
            Thank you for purchasing CashKit! Your order has been processed successfully.
          </p>

          {/* What Happens Next */}
          <div className="success-steps">
            <h2 className="success-steps-title">What happens next?</h2>
            
            <div className="success-step-list">
              <div className="success-step">
                <div className="success-step-number">1</div>
                <div className="success-step-content">
                  <h3>Check Your Email</h3>
                  <p>You'll receive download instructions within 2-3 minutes at the email address used for purchase.</p>
                </div>
              </div>

              <div className="success-step">
                <div className="success-step-number">2</div>
                <div className="success-step-content">
                  <h3>Download Your Files</h3>
                  <p>Access 1,000+ PLR PDFs and 30,000+ creator assets via secure download links.</p>
                </div>
              </div>

              <div className="success-step">
                <div className="success-step-number">3</div>
                <div className="success-step-content">
                  <h3>Start Your 7-Day Plan</h3>
                  <p>Follow the included quick-start guide to launch your first digital product this week.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="success-note">
            <h3>📧 Important</h3>
            <p>
              If you don't see the email within 5 minutes, please check your spam/junk folder. 
              For support, contact us at <a href="mailto:support@cashkit.com" className="success-link">support@cashkit.com</a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="success-buttons">
            <Link href="/landing" className="btn btn-primary">
              Back to Home
            </Link>
            <Link href="/landing#faq" className="btn btn-secondary">
              View FAQ
            </Link>
          </div>

          {/* Footer Note */}
          {transactionId && (
            <p className="success-transaction">
              Transaction ID: {transactionId}
            </p>
          )}
        </div>
      </div>
    </>
  );
}