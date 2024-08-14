"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface Verse {
  number: number;
  content: string;
}

interface Book {
  title: string;
  verses: Verse[];
}

const BIBLE_CHAPTERS: number[] = [
  50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150,
  31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16,
  24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1,
  22,
];

const getRandomBibleBook = (): number => Math.floor(Math.random() * 66) + 1;

const getRandomBibleChapter = (bookNumber: number): number =>
  Math.floor(Math.random() * BIBLE_CHAPTERS[bookNumber - 1]) + 1;

const parseBookHtml = (html: string): Book => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const spans = doc.querySelectorAll("p span");

  let title = "";
  const verses: Verse[] = [];

  spans.forEach((span) => {
    const text = span.textContent?.trim() ?? "";
    if (span.id.startsWith("v19-31-0")) {
      title = text;
    } else {
      const verseMatch = /^(\d+)\s(.+)/.exec(text);
      if (verseMatch) {
        verses.push({
          number: parseInt(verseMatch[1], 10),
          content: verseMatch[2],
        });
      } else if (verses.length > 0) {
        verses[verses.length - 1].content += " " + text;
      }
    }
  });

  return { title, verses };
};

const DailyScripture: React.FC = () => {
  const [scripture, setScripture] = useState({ title: "", verse: "" });

  const fetchScripture = useCallback(async () => {
    try {
      const bookNumber = getRandomBibleBook();
      const chapter = getRandomBibleChapter(bookNumber);
      const { data } = await axios.get(`/book/${bookNumber}/${chapter}`);
      const { verses } = parseBookHtml(data.content);
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      setScripture({
        title: data.title,
        verse: `${randomVerse.number}. ${randomVerse.content}`,
      });
    } catch (error) {
      console.error("Error fetching daily text:", error);
      setScripture({ title: "", verse: "" });
    }
  }, []);

  useEffect(() => {
    fetchScripture();
  }, [fetchScripture]);

  return (
    <div className="relative rounded-3xl">
      <div className="text-nowrap text-base font-semibold text-[var(--primary-fuchsia)]">
        {scripture.title}
      </div>
      <div className="text-wrap w-96 overflow-auto no-scrollbar h-14 text-sm text-[var(--primary)]">
        {scripture.verse}
      </div>
    </div>
  );
};

export default React.memo(DailyScripture);
