"use client"; // Ensure this is the very first line

import React, { useState, useEffect } from "react";

const WavyBackground = ({ count }: { count: number }) => {
  const [waves, setWaves] = useState([]);

  useEffect(() => {
      const newWaves: any = [];
      for (let i = 0; i < count; i++) {
        newWaves.push(
          <svg
            key={i}
            viewBox="560 0 1200 1200"
            xmlns="http://www.w3.org/2000/svg"
            className="svgwave"
            style={{ top: 0, left: -2000 + i * 100 }}
          >
            <path
              id="wavyPath"
              d="M0,0 Q300,600 900,900 T1500,2200"
              stroke="#151515"
              opacity={0.3}
              fill="transparent"
            />
            <defs>
              <linearGradient
                id="myGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="40%"
                  style={{ stopColor: "#00345A", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#0093FF", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <rect
              className="rect"
              rx={5}
              ry={5}
              style={{
                fill: "url(#myGradient)",
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          </svg>
        );
      }
      setWaves(newWaves);
  }, [count]);

  return <div>{waves}</div>;
};

export default WavyBackground;
