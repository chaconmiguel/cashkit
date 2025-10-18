import styles from "./styles/Section.module.css";

export default function WeekOneRoadmap() {
  const steps = [
    { day: "Day 1", text: "Set up project and environment" },
    { day: "Day 2", text: "Implement core sections" },
    { day: "Day 3", text: "Add Stripe checkout" },
    { day: "Day 4", text: "Polish UI and animations" },
    { day: "Day 5", text: "Write tests and QA" },
    { day: "Day 6", text: "Analytics and optimizations" },
    { day: "Day 7", text: "Deploy to Vercel" },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Week-One Roadmap</h2>
      <ol className={styles.list}>
        {steps.map((s) => (
          <li key={s.day}>
            <strong>{s.day}:</strong> {s.text}
          </li>
        ))}
      </ol>
    </section>
  );
}


