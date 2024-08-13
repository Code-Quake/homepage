"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { INewsCard } from "./NewsInterfaces";

interface NewsStackProps {
  items: INewsCard[];
  offset?: number;
  scaleFactor?: number;
  duration: number;
}

export const NewsStack: React.FC<NewsStackProps> = ({
  items,
  offset = 10,
  scaleFactor = 0.06,
  duration,
}) => {
  const [cards, setCards] = useState<INewsCard[]>(items);

  const nextCard = useCallback(() => {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(nextCard, duration);
    return () => clearInterval(interval);
  }, [duration, nextCard]);

  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.8 },
      visible: (index: number) => ({
        opacity: 1,
        scale: 1 - index * scaleFactor,
        left: index * -offset,
        zIndex: items.length - index,
        transition: { duration: 0.3 },
      }),
    }),
    [items.length, offset, scaleFactor]
  );

  return (
    <div className="relative w-full h-[25rem]">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute weather-data-card h-full w-[65%] rounded-3xl p-3 shadow-md border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col items-center"
            style={{ transformOrigin: "left center" }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            custom={index}
            onClick={nextCard}
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="absolute z-10 flex flex-col left-0 lg:top-0 w-24 rounded-tl-3xl rounded-e-[2.5rem] h-30 lg:h-28 currentLight text-light">
                  <div className="flex-1 p-2 currentLight grid place-content-center shadow-[5px_5px_10px_0_rgba(2,88,119,0.3)] rounded-br-[1.5rem] rounded-tl-3xl">
                    <div className="flex items-center flex-col currentHighlights">
                      <div className="text-[1.25rem]">{card.newsSource}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="relative top-[-10px] left-[-80px] w-60">
                  <img
                    src={card.urlToImage}
                    alt={card.title}
                    className="w-full mb-4 mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-rows-2 w-full pt-2">
              <div>
                <h2 className="text-base text-[var(--primary-fuchsia)] opacity-80 mb-1">
                  <Link
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {card.title}
                  </Link>
                </h2>
              </div>
              <div>
                <div className="text-[var(--widget-text-color)] newsDescription text-sm">
                  {card.description}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(NewsStack);
