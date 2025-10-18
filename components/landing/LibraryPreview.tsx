import { useEffect, useState } from "react";
import styles from "./styles/Section.module.css";

type LibraryItem = {
  category: string;
  count: number;
  samples: string[];
};

export default function LibraryPreview() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch("/data/library.json");
        if (!res.ok) throw new Error("Failed to load library");
        const data = (await res.json()) as LibraryItem[];
        setItems(data);
      } catch {
        setError("Unable to load library preview.");
      }
    };
    fetchLibrary();
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Library Preview</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.category} className={styles.card}>
            <strong>{item.category}</strong>
            <div>{item.count} PDFs</div>
          </div>
        ))}
      </div>
    </section>
  );
}


