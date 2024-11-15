'use client';
import React, { useRef, useState, useEffect } from "react";

interface FullscreenIframeProps {
  src: string;
  width?: string | number;
  height?: string | number;
  fullscreenKey?: string;
}

const FullscreenIframe: React.FC<FullscreenIframeProps> = ({
  src,
  width = "100%",
  height = "100%",
  fullscreenKey = "f",
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === fullscreenKey.toLowerCase() &&
        event.ctrlKey
      ) {
        toggleFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenKey]);

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
    <div>
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