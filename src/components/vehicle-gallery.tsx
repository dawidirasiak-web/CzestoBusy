"use client";

import Image from "next/image";
import { useState } from "react";

export function VehicleGallery({ images, name, type, tone }: { images: readonly string[]; name: string; type: string; tone: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return <div className={`vehicle-detail-visual ${tone}`}><span>{type}</span><div className="vehicle-silhouette"><i/><b/><b/></div><p>CZĘSTO BUSY</p></div>;
  }

  function changeImage(direction: number) {
    setSelectedIndex((current) => (current + direction + images.length) % images.length);
  }

  return (
    <div className="vehicle-detail-visual vehicle-photo-gallery">
      <div className="gallery-main">
        <Image src={images[selectedIndex]} alt={`${name} - zdjęcie ${selectedIndex + 1}`} fill priority={selectedIndex === 0} sizes="(max-width: 900px) 100vw, 50vw" />
        <span className="gallery-count">{String(selectedIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button className="gallery-arrow previous" onClick={() => changeImage(-1)} type="button" aria-label="Poprzednie zdjęcie">←</button>
        <button className="gallery-arrow next" onClick={() => changeImage(1)} type="button" aria-label="Następne zdjęcie">→</button>
      </div>
      <div className="gallery-thumbnails" aria-label={`Galeria ${name}`}>
        {images.map((image, index) => <button className={index === selectedIndex ? "active" : ""} key={image} onClick={() => setSelectedIndex(index)} type="button" aria-label={`Pokaż zdjęcie ${index + 1}`}><Image src={image} alt="" fill sizes="100px" /></button>)}
      </div>
    </div>
  );
}
