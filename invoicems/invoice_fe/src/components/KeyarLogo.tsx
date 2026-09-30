"use client";

import Image from "next/image";
import { useState } from "react";

interface KeyarLogoProps {
  width: number;
  height: number;
  className?: string;
}

export default function KeyarLogo({ width, height, className }: KeyarLogoProps) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  if (imageUnavailable) {
    return (
      <span
        className={className}
        role="img"
        aria-label="Keyar logo"
        style={{ width, height, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#173a78", backgroundColor: "#ffffff", borderRadius: 4, fontSize: Math.min(28, width / 4), fontWeight: 800 }}
      >
        Keyar
      </span>
    );
  }

  return (
    <Image
      src="/keyarLogo.svg"
      alt="Keyar logo"
      width={width}
      height={height}
      className={className}
      style={{ width, height, objectFit: "contain" }}
      unoptimized
      onError={() => setImageUnavailable(true)}
    />
  );
}