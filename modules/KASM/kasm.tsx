'use client';
import React, { useRef, useState, useEffect } from "react";

interface FullscreenIframeProps {
  src: string;
  width?: string | number;
  height?: string | number;
}

const FullscreenIframe: React.FC<FullscreenIframeProps> = ({
  src,
  width = 640,
  height = 480,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;

    if (!isFullscreen) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleFullscreen}
        className="absolute top-[560px] left-2 z-10"
      >
        {isFullscreen ? "➖" : "➕"}
      </button>
      <iframe
        className="pl-2 pt-2 rounded-xl"
        ref={iframeRef}
        src={src}
        width={width}
        height={height}
        allowFullScreen
      />
    </div>
  );
};

export default FullscreenIframe;
