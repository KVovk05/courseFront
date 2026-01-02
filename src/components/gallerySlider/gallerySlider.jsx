import React from "react";
import "./gallerySlider.css";

const examples = [
  {
    img: "/img/kitchen.jpg",
    label: "Кухня"
  },
  {
    img: "/img/livingRoom.jpg",
    label: "Вітальня"
  },
  {
    img: "/img/office2.jpg",
    label: "Офіс"
  },
  {
    img: "/img/toilet.jpg",
    label: "Санвузол"
  }
];

export default function GallerySlider() {
  // Відображення 4 фото у 2x2 grid без розділу на до/після
  return (
    <div className="gallery-pairs-block-2x2">
      {examples.map((ex, idx) => (
        <div className="gallery-pair-2x2" key={idx}>
          <div className="gallery-img-col-2x2">
            <img src={ex.img} alt={ex.label} className="gallery-img-2x2" />
          </div>
          <div className="gallery-room-label">{ex.label}</div>
        </div>
      ))}
    </div>
  );
}
