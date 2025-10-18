import styles from "./styles/Section.module.css";

export default function PerfectForNotFor() {
  const perfectFor = [
    "Solo founders",
    "Marketers",
    "Course creators",
  ];
  const notFor = ["Complex SaaS", "Custom ERPs", "Long-form blogs"];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Perfect For / Not For</h2>
      <div className={styles.columns}>
        <div>
          <h3>Perfect For</h3>
          <ul className={styles.list}>
            {perfectFor.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Not For</h3>
          <ul className={styles.list}>
            {notFor.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


