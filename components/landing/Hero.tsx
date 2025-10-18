import styles from "./styles/Hero.module.css";
import React from "react";

type HeroProps = {
  onGetStartedClick: () => void;
};

export default function Hero({ onGetStartedClick }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.badgeRow}>
          <span className="badge">New</span>
          <span className={styles.badgeText}>Next.js 14 + Stripe Checkout</span>
        </div>
        <h1 className={styles.heading}>Launch a High‑Converting Funnel in Days, Not Weeks</h1>
        <p className={styles.subheading}>
          CashKit gives you a modern, mobile‑first landing page funnel with Stripe Checkout and analytics built‑in.
        </p>
        <div className={styles.actions}>
          <button className="cta-btn" onClick={onGetStartedClick}>
            Get Started Now
          </button>
          <a href="#how" className={styles.link}>See how it works →</a>
        </div>
        <div className={styles.previewCard}>
          <div className={styles.previewGlow} />
          <div className={styles.previewInner}>
            <div className={styles.previewGrid}>
              <div className={styles.previewItem}>
                <span className={styles.kpi}>$44</span>
                <span className={styles.kpiLabel}>One‑time</span>
              </div>
              <div className={styles.previewItem}>
                <span className={styles.kpi}>7‑Day</span>
                <span className={styles.kpiLabel}>Roadmap</span>
              </div>
              <div className={styles.previewItem}>
                <span className={styles.kpi}>100+</span>
                <span className={styles.kpiLabel}>Assets</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


