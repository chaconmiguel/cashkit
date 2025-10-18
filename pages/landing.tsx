import Head from "next/head";
import { useRef, useState, useEffect } from "react";

// Counter hook for animations
function useCountUp(end: number, duration: number = 2000, startDelay: number = 0) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    
    const timer = setTimeout(() => {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [end, duration, startDelay, hasStarted]);

  return { count, startAnimation: () => setHasStarted(true) };
}

export default function LandingPage() {
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const [typingText, setTypingText] = useState('');
  const fullText = 'Start digital dropshipping today - sell ready-made products as your own';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Counter animations
  const customers = useCountUp(647, 2000, 500);
  const revenue = useCountUp(8.4, 2500, 800);
  const reviews = useCountUp(423, 2000, 1100);
  const socialProofRef = useRef<HTMLDivElement | null>(null);

  // Trigger counter animations when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            customers.startAnimation();
            revenue.startAnimation();
            reviews.startAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (socialProofRef.current) {
      observer.observe(socialProofRef.current);
    }

    return () => observer.disconnect();
  }, [customers, revenue, reviews]);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypingText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Split text into lines for typing effect
  const renderTypingText = () => {
    const words = typingText.split(' ');
    const line1 = 'Start digital dropshipping today -';
    const line2 = 'sell ready-made products as your own';
    
    if (typingText.length <= line1.length) {
      // Still typing first line
      return (
        <>
          <span>{typingText}</span>
          <span className="typing-cursor">│</span>
        </>
      );
    } else {
      // Typing second line
      const secondLineText = typingText.slice(line1.length + 1); // +1 for the space
      return (
        <>
          <span>{line1}</span>
          <br />
          <span>{secondLineText}</span>
          <span className="typing-cursor">│</span>
        </>
      );
    }
  };

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const scrollToPricing = () => {
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
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
      setCheckoutError(message);
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>CashKit – Launch Your High-Converting Funnel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Launch a high-converting funnel with 1,000+ PLR PDFs and 30,000+ creator assets" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>
      
      {/* Floating Background Elements - REMOVED */}

      {/* Particle Effect */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo stagger-1">
              <img 
                src="/assets/logos/cashkit-logo.png" 
                alt="CashKit" 
                className="logo-image"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="logo-fallback" style={{display: 'none'}}>
                <div className="logo-icon">CK</div>
                <span>CashKit</span>
              </div>
            </div>
            <div className="nav-links stagger-2">
              <a href="#offer">What You Get</a>
              <a href="#plan">7-Day Plan</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <button 
              className="btn btn-primary btn-large stagger-3" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "BUY NOW"} <span className="bounce-arrow">→</span>
            </button>
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <div className="logo">
              <img 
                src="/assets/logos/cashkit-logo-white.png" 
                alt="CashKit" 
                className="logo-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="logo-fallback" style={{display: 'none'}}>
                <div className="logo-icon">CK</div>
                <span>CashKit</span>
              </div>
            </div>
            <button 
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close mobile menu"
            >
              ✕
            </button>
          </div>
          <nav className="mobile-nav">
            <a href="#offer" onClick={() => setMobileMenuOpen(false)}>What You Get</a>
            <a href="#plan" onClick={() => setMobileMenuOpen(false)}>7-Day Plan</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          </nav>
          <div className="mobile-menu-cta">
            <button 
              className="btn btn-primary btn-large" 
              onClick={() => {
                setMobileMenuOpen(false);
                handleCheckout();
              }}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "BUY NOW"} <span className="bounce-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-vertical">
            {/* Top Text Section */}
            <div className="hero-top">
            <div className="badge">
              <span className="badge-dot"></span>
              🔥 Limited Time: 74% OFF Ends Soon
            </div>
              
              <h1 className="hero-title">
                <span className="typing-text">{renderTypingText()}</span>
              </h1>
              
              <p className="hero-subtitle stagger-2">
                Get access to an exclusive library of <strong>1,000+ PLR digital products</strong> you can rebrand and sell as your own. Keep 100% of the profits with zero inventory or shipping hassles.
              </p>
              
              <div ref={socialProofRef} className="social-proof-numbers stagger-2">
                <div className="proof-stat">
                  <span className="stat-number">{customers.count.toLocaleString()}</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="proof-stat">
                  <span className="stat-number">${revenue.count.toFixed(1)}M+</span>
                  <span className="stat-label">Revenue Generated</span>
                </div>
                <div className="proof-stat">
                  <span className="stat-number">4.9/5</span>
                  <span className="stat-label">{reviews.count} Reviews</span>
                </div>
              </div>
            </div>
            
            {/* Video Section */}
            <div className="hero-video">
              <div className="glow-border">
                <div className="glow-content">
                  <div className="video-placeholder">
                    <div className="video-text">
                      <div className="play-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <p className="video-title">2-minute walkthrough: how digital dropshipping works</p>
                      <p className="video-subtitle">Swap with Loom/YouTube embed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Features & CTA Section */}
            <div className="hero-bottom">
              <ul className="feature-list">
                <li className="feature-item stagger-1">
                  <div className="check-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Build once, sell forever - products do not go out of stock
                </li>
                <li className="feature-item stagger-2">
                  <div className="check-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Simple stack: landing page + Stripe + instant delivery
                </li>
                <li className="feature-item stagger-3">
                  <div className="check-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Use our 1,000+ PLR PDFs and 30,000+ creator assets to ship day one
                </li>
              </ul>
              
              <div className="hero-buttons">
                <button 
                  className="btn btn-primary btn-large stagger-4" 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "REDIRECTING..." : "GET INSTANT ACCESS"}
                </button>
              <p className="hero-cta-note stagger-5">
                Just $44 one-time • Lifetime access • 14-day guarantee
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Mentions */}
      <section className="media-section">
        <div className="container-narrow">
          <p className="media-title">AS SEEN ON:</p>
          <div className="media-logos">
            <div className="media-logo">
              <img src="/assets/images/bbc.png" alt="BBC" />
            </div>
            <div className="media-logo">
              <img src="/assets/images/forbes.png" alt="Forbes" />
            </div>
            <div className="media-logo">
              <img src="/assets/images/entreprenuer.png" alt="Entrepreneur" />
            </div>
            <div className="media-logo">
              <img src="/assets/images/theguradian.png" alt="The Guardian" />
            </div>
            <div className="media-logo">
              <img src="/assets/images/businessinsider.png" alt="Business Insider" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="value-props">
        <div className="container">
          <h2 className="section-title">Traditional dropshipping is dead,<br />resell digital products and keep 100% profit!</h2>
          <p className="section-subtitle">Digital Dropshipping is your way to profit from digital products without actually making them.<br />No inventory. No Shipping Hassle. Pure Profit.</p>
          
          <div className="props-grid">
            <div className="prop-card stagger-1">
              <div className="prop-icon">📚</div>
              <h3>Done-for-you Digital Products with PLR</h3>
              <p>Premium done-for-you digital products with private label rights meaning you can resell them as your own without having to create them from scratch.</p>
            </div>
            <div className="prop-card stagger-2">
              <div className="prop-icon">💰</div>
              <h3>Sell & Keep 100% of the Profit</h3>
              <p>No middle-men, commissions, royalties or supplier fees. Keep everything you earn.</p>
            </div>
            <div className="prop-card stagger-3">
              <div className="prop-icon">🎨</div>
              <h3>Ebook Rebrand Kit</h3>
              <p>Fully editable drag-and-drop cover template PSD files if you wish to rebrand & customize the books as your own.</p>
            </div>
            <div className="prop-card stagger-4">
              <div className="prop-icon">🎬</div>
              <h3>30,000+ 4K Faceless Media Library</h3>
              <p>Access a royalty-free library of viral-style faceless videos perfect for content creators, social media and ad campaigns.</p>
            </div>
          </div>
          
          <div className="value-props-cta">
            <button 
              className="btn btn-primary btn-large stagger-5" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "START DIGITAL DROPSHIPPING"} <span className="bounce-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Inside the Library */}
      <section id="offer" className="section library-section">
        <div className="container-narrow">
          <div className="section-header">
            <h2 className="section-title">Inside the library</h2>
            <p className="section-subtitle">You are not buying random PDFs. You are getting a curated, rebrandable library built to ship offers fast - plus a vault of creator assets for distribution.</p>
          </div>
          
          <div className="library-features">
            <div className="library-feature stagger-1">
              <div className="feature-icon">
                <span className="feature-number">1</span>
              </div>
              <div className="feature-info">
                <h3 className="feature-title">1,000+ rebrandable PDFs</h3>
                <p className="feature-description">PLR rights included. Swap covers with our Canva/PSD kit and list in minutes.</p>
              </div>
            </div>
            
            <div className="library-feature stagger-2">
              <div className="feature-icon">
                <span className="feature-number">2</span>
              </div>
              <div className="feature-info">
                <h3 className="feature-title">30,000+ creator assets</h3>
                <p className="feature-description">Luxury B-roll, captions, hooks and ad angles for short-form and paid.</p>
              </div>
            </div>
            
            <div className="library-feature stagger-3">
              <div className="feature-icon">
                <span className="feature-number">3</span>
              </div>
              <div className="feature-info">
                <h3 className="feature-title">Delivery playbooks</h3>
                <p className="feature-description">Step-by-step for Shopify, Gumroad and Etsy. Instant delivery templates.</p>
              </div>
            </div>
          </div>
          
          <div className="library-cta">
            <button 
              className="btn btn-primary btn-large stagger-4" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "GET ACCESS NOW"} <span className="bounce-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7-Day Plan Section */}
      <section id="plan" className="section plan-section">
        <div className="container-narrow">
          <div className="section-header">
            <h2 className="section-title stagger-1">Your first week, mapped</h2>
            <p className="section-subtitle stagger-2">Shipped beats perfect. Follow this path and you will list your first offers in a day, with promo running by the weekend.</p>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            <div className="timeline-step" data-step="1">
              <div className="timeline-dot">
                <span>1</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-day">Day 1</div>
                <h3>Set up checkout</h3>
                <p>Create a one-page offer and connect Stripe. Use our prebuilt layout + copy.</p>
              </div>
            </div>
            
            <div className="timeline-step" data-step="2">
              <div className="timeline-dot">
                <span>2</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-day">Day 2</div>
                <h3>Brand + load products</h3>
                <p>Drop in your logo, pick a palette, upload your first 10-20 PDF offers.</p>
              </div>
            </div>
            
            <div className="timeline-step" data-step="3">
              <div className="timeline-dot">
                <span>3</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-day">Day 3</div>
                <h3>Post daily content</h3>
                <p>Use the 30k asset vault: reels B-roll, hooks, captions. Ship 3 posts/day.</p>
              </div>
            </div>
            
            <div className="timeline-step" data-step="4">
              <div className="timeline-dot">
                <span>4-5</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-day">Day 4-5</div>
                <h3>Tweak your offer</h3>
                <p>Refine headline, bonuses, FAQs using our high-converting frameworks.</p>
              </div>
            </div>
            
            <div className="timeline-step" data-step="5">
              <div className="timeline-dot">
                <span>6-7</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-day">Day 6-7</div>
                <h3>Kick on paid</h3>
                <p>Spin light ads or creator shoutouts. Track clicks → checkout → sales.</p>
              </div>
            </div>
          </div>
          
          <div className="plan-cta">
            <button 
              className="btn btn-primary btn-large stagger-6" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "START YOUR 7-DAY JOURNEY"} <span className="bounce-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container-narrow">
          <div className="testimonials-header">
            <h2 className="section-title">"I got my freedom back because I no longer trade my time for Money"</h2>
            <div className="rating">
              <div className="stars">★★★★★</div>
              <p>4.9/5 Stars based on 423 user reviews</p>
            </div>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card stagger-1">
              <div className="testimonial-content">
                <p>"Pretty good quality. The products are easy to resell, and I've made a few sales on my stan store already!!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">NM</div>
                <div className="author-info">
                  <div className="author-name">Nicole M.</div>
                  <div className="author-title">Verified Customer</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card stagger-2">
              <div className="testimonial-content">
                <p>"I'm a single-mom & door dasher and wasn't sure if this would work at first, but it actually does! I set up my shopify store and started posting on facebook. I've made $332 sales my first week so far !!!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">P</div>
                <div className="author-info">
                  <div className="author-name">Pamela</div>
                  <div className="author-title">Verified Customer</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card stagger-3">
              <div className="testimonial-content">
                <p>"The PDFs are solid, and people seem interested in them, especially the ecom ones. Good side income so far, I'll start scaling with ads soon."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MM</div>
                <div className="author-info">
                  <div className="author-name">Michael M.</div>
                  <div className="author-title">Verified Customer</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonials-cta">
            <button 
              className="btn btn-primary btn-large stagger-4" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "GET YOUR FREEDOM TODAY"} <span className="bounce-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Objection Handling Section */}
      <section className="objections-section">
        <div className="container">
          <div className="objections-header">
            <h2 className="section-title">Common questions we get</h2>
            <p className="section-subtitle">Here's what people ask before they start</p>
          </div>
          
          <div className="objections-grid">
            <div className="objection-item">
              <div className="objection-question">
                <div className="question-icon">🤔</div>
                <h3>"I don't have any experience with digital products"</h3>
              </div>
              <div className="objection-answer">
                <p>Perfect! Our step-by-step guides are designed for complete beginners. You'll get platform setup tutorials, product upload instructions, and marketing templates. Most people launch their first product within 24 hours.</p>
              </div>
            </div>
            
            <div className="objection-item">
              <div className="objection-question">
                <div className="question-icon">⏰</div>
                <h3>"I don't have time to create content"</h3>
              </div>
              <div className="objection-answer">
                <p>That's exactly why we created this. You get 30,000+ ready-made social media assets, captions, and hooks. No need to create anything from scratch - just rebrand and post.</p>
              </div>
            </div>
            
            <div className="objection-item">
              <div className="objection-question">
                <div className="question-icon">💰</div>
                <h3>"Is the market too saturated?"</h3>
              </div>
              <div className="objection-answer">
                <p>Digital products are a $400+ billion market that's growing every year. With 1,000+ different PLR products across multiple niches, you can find untapped opportunities others are missing.</p>
              </div>
            </div>
            
            <div className="objection-item">
              <div className="objection-question">
                <div className="question-icon">🛠️</div>
                <h3>"What if I need help getting started?"</h3>
              </div>
              <div className="objection-answer">
                <p>You get detailed setup guides for Shopify, Gumroad, and Etsy, plus our 7-day launch plan. Everything is laid out step-by-step so you know exactly what to do next.</p>
              </div>
            </div>
            
            <div className="objection-item">
              <div className="objection-question">
                <div className="question-icon">📈</div>
                <h3>"How do I know this actually works?"</h3>
              </div>
              <div className="objection-answer">
                <p>Our 647 customers have generated over $8.4M in revenue using these exact products and strategies. Plus you get a 14-day money-back guarantee - if it doesn't work, get a full refund.</p>
              </div>
            </div>
            
            <div className="objection-item">
              <div className="objection-question">
                <div className="question-icon">🔄</div>
                <h3>"What if I don't make any sales?"</h3>
              </div>
              <div className="objection-answer">
                <p>Follow our proven 7-day launch plan and use our high-converting templates. If you're not profitable within 14 days, we'll refund every penny. You literally can't lose.</p>
              </div>
            </div>
          </div>
          
          <div className="objections-cta">
            <button 
              className="btn btn-primary btn-large" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "START TODAY - RISK FREE"} <span className="bounce-arrow">→</span>
            </button>
            <p className="cta-note">14-day money-back guarantee • Instant access • No monthly fees</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="pricing">
        <div className="container">
          <div className="pricing-header">
            <h2 className="section-title stagger-1">Get lifetime access</h2>
            <p className="section-subtitle stagger-2">One price today. Use forever. Commercial PLR rights included.</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-features slide-left">
              <h3>Inside the Kit</h3>
              <ul className="features-list">
                {[
                  '1,000+ PLR PDFs (money, biz, fitness, spirituality, marketing)',
                  '30,000+ assets (luxury b-roll, captions, hooks, covers)',
                  'Brand kit & mockups (Canva)',
                  'Delivery playbook (Shopify/Gumroad/Etsy)',
                  'Commercial PLR license'
                ].map((item, i) => (
                  <li key={i} className={`stagger-${i + 1}`}>
                    <div className="check-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pricing-card slide-right">
              <div className="pricing-content">
                <div className="price-anchor">
                  <span className="original-price">Usually $167</span>
                  <span className="discount-badge">74% OFF</span>
                </div>
                <p className="price-label">Limited Time Price</p>
                <p className="price">$44</p>
                <p className="price-note">One-time payment • You save $123</p>
                <div className="urgency-indicator">
                  <span className="urgency-dot"></span>
                  Only 23 copies left at this price
                </div>
                
                <button 
                  className="btn btn-primary btn-large pricing-btn" 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "REDIRECTING..." : "PAY SECURELY WITH STRIPE"} <span className="bounce-arrow">→</span>
                </button>
                
                <p className="security-note">Secure checkout - Stripe</p>
                
                {checkoutError && (
                  <div className="checkout-error">
                    <p style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem'}}>
                      {checkoutError}
                    </p>
                  </div>
                )}
                
                <ul className="features-list">
                  {['14-day money-back guarantee', 'Instant email delivery', 'VAT/GST handled by Stripe'].map((item, i) => (
                    <li key={i} className={`stagger-${i + 1}`}>
                      <div className="check-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="guarantee-section">
            <div className="guarantee-card glow-border stagger-3">
              <div className="guarantee-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3"/>
                  <path d="M3 12c1.5 0 3-1 3-3s-1.5-3-3-3-3 1-3 3 1.5 3 3 3"/>
                  <path d="M12 3c0 1.5-1 3-3 3s-3-1.5-3-3 1-3 3-3 3 1.5 3 3"/>
                  <path d="M12 21c0-1.5 1-3 3-3s3 1.5 3 3-1 3-3 3-3-1.5-3-3"/>
                </svg>
              </div>
              <div className="guarantee-content">
                <h3 className="guarantee-title">14-Day Money-Back Guarantee</h3>
                <p className="guarantee-text">Try CashKit. If it is not the highest-value PLR bundle you have used, email us within 14 days for a full refund. No hoops.</p>
                <div className="guarantee-features">
                  <div className="guarantee-feature">
                    <div className="check-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Full refund within 14 days</span>
                  </div>
                  <div className="guarantee-feature">
                    <div className="check-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>No questions asked</span>
                  </div>
                  <div className="guarantee-feature">
                    <div className="check-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Keep what you've downloaded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about CashKit, PLR rights, delivery, and getting started.
            </p>
          </div>
          
          <div className="faq-container">
            {[
              {
                question: "What is digital dropshipping?",
                answer: "Digital dropshipping is selling downloadable products that deliver instantly after payment - no suppliers, no shipping, no inventory risk. You sell digital products like PDFs, courses, templates, and keep 100% of the profits."
              },
              {
                question: "Do I get PLR rights?",
                answer: "Yes, you get full Private Label Rights. You can rebrand, edit, and resell the included PDFs and assets. See the license.txt file for any specific limitations."
              },
              {
                question: "How do I deliver products to my buyers?",
                answer: "Use platforms like Shopify + Digital Downloads, Gumroad, or Etsy. We include quick-start guides for each platform with instant delivery templates."
              },
              {
                question: "Will this work if I have no audience?",
                answer: "Yes! We include 30,000+ creator assets (videos, captions, hooks) and a 7-day plan to help you build an audience. Post 3 pieces of content daily using our vault assets."
              },
              {
                question: "Can I run paid ads?",
                answer: "Yes! We include ad-safe angles and examples for TikTok, Facebook, and Instagram. Always follow platform advertising policies."
              },
              {
                question: "What's included in the 30,000+ creator assets?",
                answer: "High-quality 4K faceless videos, B-roll footage, viral hooks, captions, ad angles, and social media templates. Perfect for creating content and running ads."
              },
              {
                question: "How quickly do I get access?",
                answer: "Instant! After payment, you will receive an email with download links within 2-3 minutes. All files are hosted on secure cloud storage."
              },
              {
                question: "Is this a one-time payment?",
                answer: "Yes! This is a one-time payment of $44 for lifetime access. No monthly subscriptions or hidden fees."
              }
            ].map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          
          <div className="faq-cta">
            <button 
              className="btn btn-primary btn-large" 
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "REDIRECTING..." : "GET CASHKIT NOW"} <span className="bounce-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} CashKit. All rights reserved.</p>
          <p className="small">Demo copy - set your Stripe link and confirm price before launch.</p>
        </div>
      </footer>

      {/* Sticky CTA Button */}
      <div className="sticky-cta">
        <div className="sticky-cta-content">
          <div className="sticky-cta-text">
            <span className="sticky-cta-title">Ready to start?</span>
            <span className="sticky-cta-subtitle">Get CashKit now - $44 one-time</span>
          </div>
          <button 
            className="btn btn-primary sticky-cta-button" 
            onClick={handleCheckout}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? "LOADING..." : "BUY NOW"} <span className="bounce-arrow">→</span>
          </button>
        </div>
      </div>
    </>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="faq-item">
      <button 
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg 
          className={`faq-icon ${isOpen ? 'rotated' : ''}`}
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}