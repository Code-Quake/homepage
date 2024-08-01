"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import links from "../../data/links.json";
import styles from "./Links.module.css";

interface LinkItem {
  href: string;
  title: string;
  imgSrc: string;
  srclocal: boolean;
  urllocal: boolean;
  category: string;
}

interface TabData {
  title: string;
  value: string;
  icon: string;
}

const tabData: TabData[] = [
  { title: "Comics", value: "comics", icon: "haha.jpg" },
  { title: "Updates", value: "updates", icon: "news.jpg" },
  { title: "UHaul", value: "uhaul", icon: "uhaul.png" },
  { title: "Shopping", value: "shopping", icon: "cart.png" },
  { title: "Development", value: "development", icon: "dev.webp" },
  { title: "Admin", value: "admin", icon: "admin.png" },
];

const accordionData = [
  {
    title: "My name?",
    content: "Hi, You can call me Dandi.",
  },
  {
    title: "What am I interested in?",
    content: "All things about Technology! Information technology especially.",
  },
  {
    title: "What is my hobby?",
    content: "I love music, watching movies, and maybe designing.",
  },
];


const Links: React.FC = () => {
  const linksByCategory = useMemo(() => {
    return links.reduce((acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = [];
      }
      acc[link.category].push(link);
      return acc;
    }, {} as Record<string, LinkItem[]>);
  }, []);

  const renderLink = (
    { href, title, imgSrc, srclocal, urllocal }: LinkItem,
    key: number
  ) => (
    <div className="cardLink" key={key}>
      <a href={href} className="item size-small" target="_blank">
        <div className="tile-title">
          <span className="text">{title}</span>
        </div>
        <div>
          <Image
            src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${imgSrc}&size=32`}
            alt={title}
            width={32}
            height={32}
            unoptimized
          />
        </div>
      </a>
    </div>
  );

  const renderLinks = (category: string) =>
    linksByCategory[category]?.map(renderLink) || null;

  const tabs = useMemo(
    () =>
      tabData.map((tab) => ({
        title: tab.title,
        value: tab.value,
        icon: tab.icon,
      })),
    []
  );

    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index:any) => {
      setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <div className={styles.accordion} style={{ position: "relative" }}>
      {tabs.map((item, index) => (
        <div key={index} className={styles.accordionItem}>
          <button
            className={styles.accordionTitle}
            onClick={() => toggleAccordion(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-12 w-12 mr-4"
                />
                {item.title}
              </div>
              <div
                className={`${styles.accordionButton} ${
                  openIndex === index ? styles.open : ""
                } float-end flex`}
              ></div>
            </div>
          </button>
          <div
            className={`${styles.accordionContent} ${
              openIndex === index ? styles.open : ""
            }`}
          >
            <div className="grid grid-cols-3 gap-x-3 gap-y-3 linksGrid">
              {renderLinks(item.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Links;
