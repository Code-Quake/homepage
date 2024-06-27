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
            <div className="relative left-[10%] w-4/5">
              <img
                src={card.urlToImage}
                alt={card.title}
                className="w-full mb-4 mt-2"
              />
            </div>
            <h2 className="text-base newsTitle mb-2">
              <Link href={card.url} target="_blank" rel="noopener noreferrer">
                {card.title}
              </Link>
            </h2>
            <div className="newsDescription text-sm">{card.description}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(NewsStack);
