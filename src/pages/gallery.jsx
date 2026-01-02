// Файл сторінки Галерея більше не використовується. Можна видалити цей файл.
import React from "react";
import NavMenu from "../components/nav-menu/nav-menu";
import Footer from "../components/footer/footer";
import "../style.css";

const Gallery = () => {
  const galleryImages = [
    { id: 1, img: "/img/1.webp", title: "Генеральне прибирання квартири" },
    { id: 2, img: "/img/2.webp", title: "Підтримуюче прибирання офісу" },
    { id: 3, img: "/img/3.webp", title: "Післяремонтне прибирання" },
    { id: 4, img: "/img/4.webp", title: "Миття вікон" },
    { id: 5, img: "/img/5.webp", title: "Хімчистка килимів" },
    { id: 6, img: "/img/6.webp", title: "Прибирання офісних приміщень" },
  ];

  return (
    <>
      <NavMenu />
      <main>
        <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem', background: 'var(--bg-light)' }}>
          <h1>Наші роботи</h1>
        </div>
        <article style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
          <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.125rem', color: 'var(--text-light)' }}>
            Ось приклади наших робіт. Ми пишаємося якістю та увагою до деталей.
          </p>
          <div className="grid-container" style={{ marginTop: '2rem' }}>
            {galleryImages.map((item) => (
              <div key={item.id} className="grid-element" style={{ minHeight: 'auto' }}>
                <img src={item.img} alt={item.title} className="img-init" />
                <h5 style={{ marginTop: '1rem' }}>{item.title}</h5>
              </div>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default Gallery;

