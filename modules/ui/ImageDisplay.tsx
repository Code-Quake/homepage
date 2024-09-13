"use client";
import React from "react";
import Image from "next/image";

interface ImageDisplayProps {
  imgSrc: string;
  title: string;
  width: string;
  height: string;
  divClasses?: string;
  imgClasses?: string;
  unoptimized?: boolean;
  priority?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imgSrc, title, width, height, divClasses, imgClasses, priority=false, unoptimized=false }) => {
  return (
    <div className={`relative ${width} ${height} ${divClasses}`}>
      <Image
        src={imgSrc}
        alt={title}
        fill
        className={imgClasses}
        unoptimized={unoptimized}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  );
};

export default React.memo(ImageDisplay);