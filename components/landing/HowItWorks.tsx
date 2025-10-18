import styles from "./styles/Section.module.css";

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>How It Works</h2>
      <div className={styles.embedWrapper}>
        <iframe
          className={styles.embed}
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="How It Works"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className={styles.fallback}>
        If the video does not load, watch it on
        {" "}
        <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
          YouTube
        </a>
        .
      </p>
    </section>
  );
}


