import { useEffect, useState } from "react";
import styles from "./styles/Section.module.css";

type Sale = {
  name: string;
  state: string;
  amount: number;
};

export default function RecentSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("/data/sales.json");
        if (!res.ok) throw new Error("Failed to load sales");
        const data = (await res.json()) as Sale[];
        setSales(data);
      } catch {
        setError("Unable to load recent sales right now.");
      }
    };
    fetchSales();
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recent Sales</h2>
      {error && <p className={styles.error}>{error}</p>}
      <ul className={styles.list}>
        {sales.map((s, idx) => (
          <li key={idx}>{`${s.name} from ${s.state} purchased $${s.amount}`}</li>
        ))}
      </ul>
    </section>
  );
}


