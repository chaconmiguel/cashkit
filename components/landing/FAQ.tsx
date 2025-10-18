import { useState } from "react";
import styles from "./styles/Section.module.css";

const QUESTIONS = [
  { q: "Do I need a backend?", a: "Only for Stripe API route handled by Next.js." },
  { q: "Is this mobile-friendly?", a: "Yes, built mobile-first with CSS Modules." },
  { q: "Can I add more sections?", a: "Absolutely, components are modular." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>FAQ</h2>
      <ul className={styles.list}>
        {QUESTIONS.map((item, idx) => (
          <li key={idx}>
            <button
              className={styles.accordion}
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
            >
              {item.q}
            </button>
            {open === idx && <p className={styles.answer}>{item.a}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}


