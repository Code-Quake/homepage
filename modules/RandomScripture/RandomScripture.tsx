"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  faCalendarWeek,
  faAnglesRight,
  faAnglesLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const [verseNum, setVerseNum] = useState(0);
  const [bookNum, setBookNum] = useState(0);
  const [chapterNum, setChapterNum] = useState(0);
  const [verses, setVerses] = useState<Verse[]>([]);
  const initialRenderRef = useRef(true);

  const fetchScripture = useCallback(async (isInitialLoad: boolean = false) => {
    try {
      let newBookNum = bookNum;
      let newChapterNum = chapterNum;

      if (isInitialLoad || bookNum === 0 || chapterNum === 0) {
        newBookNum = getRandomBibleBook();
        newChapterNum = getRandomBibleChapter(newBookNum);
        setBookNum(newBookNum);
        setChapterNum(newChapterNum);
      }

      const { data } = await axios.get(`/book/${newBookNum}/${newChapterNum}`);
      const parsedBook = parseBookHtml(data.content);
      setVerses(parsedBook.verses);

      let verse: Verse;
      if (isInitialLoad || verseNum === 0) {
        verse = parsedBook.verses[Math.floor(Math.random() * parsedBook.verses.length)];
        setVerseNum(verse.number);
      } else {
        verse = parsedBook.verses[verseNum - 1] || parsedBook.verses[0];
      }

      setScripture({
        title: data.title,
        verse: `${verse.number}. ${verse.content}`,
      });
    } catch (error) {
      console.error("Error fetching scripture:", error);
      setScripture({ title: "", verse: "" });
    }
  }, [bookNum, chapterNum, verseNum]);

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      fetchScripture(true);
    }
  }, [fetchScripture]);

  useEffect(() => {
    if (verseNum > 0 && verses.length > 0) {
      const verse = verses[verseNum - 1];
      setScripture(prev => ({
        ...prev,
        verse: `${verse.number}. ${verse.content}`,
      }));
    }
  }, [verseNum, verses]);

  const handlePreviousVerse = () => {
    setVerseNum(prevNum => Math.max(1, prevNum - 1));
  };

  const handleNextVerse = () => {
    setVerseNum(prevNum => Math.min(verses.length, prevNum + 1));
  };

  return (
    <div className="relative rounded-3xl">
      <div className="flex items-center justify-start align-middle font-semibold text-[var(--primary-fuchsia)]">
        <span
          className="tooltip"
          data-tooltip="Previous Verse"
          data-tooltip-position="left"
        >
          <FontAwesomeIcon
            onClick={handlePreviousVerse}
            icon={faAnglesLeft}
            role="button"
            aria-label="Last Week"
            className="text-[var(--primary)] pr-2"
          />
        </span>
        <span>{scripture.title}</span>
        <span
          className="tooltip"
          data-tooltip="Next Verse"
          data-tooltip-position="right"
        >
          <FontAwesomeIcon
            onClick={handleNextVerse}
            icon={faAnglesRight}
            role="button"
            aria-label="Last Week"
            className="text-[var(--primary)] pl-2"
          />
        </span>
      </div>
      <div className="text-wrap w-96 overflow-auto no-scrollbar h-14 text-sm text-[var(--primary)]">
        {scripture.verse}
      </div>
    </div>
  );
};

export default React.memo(DailyScripture);
