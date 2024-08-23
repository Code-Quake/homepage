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
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imgSrc, title, width, height, divClasses, imgClasses, unoptimized=false }) => {
  return (
    <div className={`relative ${width} ${height} ${divClasses}`}>
      <Image
        src={imgSrc}
        alt={title}
        fill
        className={imgClasses}
        unoptimized={unoptimized}
      />
    </div>
  );
};

export default React.memo(ImageDisplay);