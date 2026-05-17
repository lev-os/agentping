import React, { useRef, useState } from "react";
import "./holographic-card.css";

export interface HolographicCardProps {
  holder?: string;
  number?: string;
  expiry?: string;
}

export function HolographicCard({
  holder = "JOHN DAO",
  number = "4921  ****  ****  7782",
  expiry = "12/32",
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
    });
  };

  return (
    <div className="holo-container">
      <div
        className="holo-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
      >
        <div className="holo-content">
          <div className="holo-chip" />
          <div className="holo-number">{number}</div>
          <div className="holo-meta">
            <span>{holder}</span>
            <span>EXP: {expiry}</span>
          </div>
        </div>
        <div className="holo-sheen" />
      </div>
    </div>
  );
}
