/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import links from "../../data/links.json";
import styles from "./Links.module.css";
import {
  faPersonFallingBurst,
  faNewspaper,
  faTruckMoving,
  faCartShopping,
  faComputer,
  faGears,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface LinkItem {
  href: string;
  title: string;
  imgSrc: string;
  srclocal: boolean;
  urllocal: boolean;
  category: string;
}

interface SectionData {
  title: string;
  value: string;
  icon: IconProp;
}

const sectionData: SectionData[] = [
  { title: "Comics", value: "comics", icon: faPersonFallingBurst },
  { title: "Updates", value: "updates", icon: faNewspaper },
  { title: "UHaul", value: "uhaul", icon: faTruckMoving },
  { title: "Shopping", value: "shopping", icon: faCartShopping },
  { title: "Development", value: "development", icon: faComputer },
  { title: "Admin", value: "admin", icon: faGears },
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
    <div className="cardLinkOuter" key={key}>
      <div className="cardLinkInner">
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
    </div>
  );

  const renderLinks = (category: string) =>
    linksByCategory[category]?.map(renderLink) || null;

  const sections = useMemo(
    () =>
      sectionData.map((tab) => ({
        title: tab.title,
        value: tab.value,
        icon: tab.icon,
      })),
    []
  );

  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion} style={{ position: "relative" }}>
      {sections.map((item, index) => (
        <div key={index} className={styles.accordionItem}>
          <button
            className={styles.accordionTitle}
            onClick={() => toggleAccordion(index)}
          >
            <div
              className={`${styles.accordionTitleText} ${
                openIndex === index ? styles.open : ""
              } flex items-center justify-between bg-gradient-to-t from-[var(--dark-blue)] to-[var(--primary-dark)] pt-3 pb-3 rounded-md`}
            >
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={item.icon}
                  role="button"
                  className="pl-2.5 text-xl pr-2.5"
                />
                {item.title}
              </div>
              <div
                className={`${styles.accordionButton} ${
                  openIndex === index ? styles.open : ""
                }
                 float-end flex mr-2`}
              ></div>
            </div>
          </button>
          <div
            className={`${styles.accordionContent} ${
              openIndex === index ? styles.open : ""
            } pl-[0.15rem] pr-[0.15rem]`}
          >
            <div className="grid grid-cols-3 p-2 cardLinkContainer">
              {renderLinks(item.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Links;
