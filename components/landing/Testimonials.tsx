"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Slider = dynamic(() => import("react-slick"), { ssr: false });
import Image from "next/image";
import styles from "./styles/Section.module.css";

type Testimonial = {
  name: string;
  avatar?: string;
  text: string;
};

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/data/testimonials.json");
        if (!res.ok) throw new Error("Failed to load testimonials");
        const data = (await res.json()) as Testimonial[];
        setItems(data);
      } catch {
        setError("Unable to load testimonials.");
      }
    };
    fetchTestimonials();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  } as const;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Testimonials</h2>
      {error && <p className={styles.error}>{error}</p>}
      <Slider {...settings}>
        {items.map((t, idx) => (
          <div key={idx} className={styles.card}>
            <Image src={t.avatar || "/fallback-avatar.svg"} alt={t.name} width={48} height={48} className={styles.avatar} />
            <blockquote>{t.text}</blockquote>
            <cite>— {t.name}</cite>
          </div>
        ))}
      </Slider>
    </section>
  );
}


