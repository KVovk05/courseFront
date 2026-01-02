import React from "react";
import { Link } from "react-router-dom";
import "../style.css"; 
import Footer from "../components/footer/footer";
import NavMenu from "../components/nav-menu/nav-menu"; 
import GallerySlider from "../components/gallerySlider/gallerySlider";

export default function HomePage() {
  return (
    <>
      <NavMenu/>
      <main>
        <article id="text">
          <section id="box2">
            <h1>
              Клінінгова компанія
            </h1>
            <p style={{ fontSize: '1.25rem', marginTop: '1rem' }}>
              Ми – не просто клінери, ми – Ваші вірні помічники та надійні партнери
            </p>
            <p style={{ marginTop: '2rem' }}>
              Наша клінінгова компанія пропонує широкий спектр послуг з професійного прибирання.
              Ми працюємо з використанням сучасного обладнання та екологічно чистих засобів,
              гарантуючи високу якість та швидкість виконання робіт. Від регулярного підтримуючого
              прибирання до глибокого післяремонтного — ми допоможемо підтримати ідеальну чистоту
              у вашому домі або офісі. Замовте послугу онлайн та отримайте швидкий розрахунок вартості!
            </p>
            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/services" className="descr-btn" style={{ margin: 0 }}>
                Переглянути послуги
              </Link>
              <Link to="/calculator" className="descr-btn" style={{ margin: 0, background: 'var(--secondary-color)' }}>
                Розрахувати вартість
              </Link>
            </div>
          </section>
        </article>
        <section style={{ maxWidth: 900, margin: '2rem auto 2rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Приклади наших робіт</h2>
          <GallerySlider />
        </section>
      </main>
      <Footer/>
    </>
  );
}
