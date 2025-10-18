import { useState } from "react";
import styles from "./styles/Section.module.css";

export default function PricingCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
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
      setError(message);
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Pricing</h2>
      <p>One-time purchase: <strong>$44</strong></p>
      <button className={styles.ctaPrimary} onClick={handleCheckout} disabled={loading}>
        {loading ? "Redirecting..." : "Buy Now"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}


