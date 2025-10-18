import styles from "./styles/Section.module.css";

export default function Features() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Features</h2>
      <ul className={styles.list}>
        <li>7-day plan overview</li>
        <li>PLR PDFs & asset icons with tooltips</li>
        <li>Mobile-first styling with CSS Modules</li>
      </ul>
    </section>
  );
}


