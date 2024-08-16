/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
import {
  RaindropItem,
  RaindropResponse,
  LinkItem,
  SectionData,
} from "./LinksInterfaces";
import useSWR from "swr";
import axios from "axios";
import { Spinner } from "@nextui-org/react";

const sectionData: SectionData[] = [
  { title: "Comics", value: "comics", icon: faPersonFallingBurst },
  { title: "Updates", value: "updates", icon: faNewspaper },
  { title: "UHaul", value: "uhaul", icon: faTruckMoving },
  { title: "Shopping", value: "shopping", icon: faCartShopping },
  { title: "Development", value: "development", icon: faComputer },
  { title: "Admin", value: "admin", icon: faGears },
];

const API_URL = "https://api.raindrop.io/rest/v1/raindrops/46913959";

function useLinks() {
  const fetcher = (url: any): any =>
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + "4a69b609-f484-4fc9-8d8c-cd8df5bddc73",
        },
      })
      .then((res) => res.data);

  const { data, isLoading, error } = useSWR<RaindropResponse, boolean, any>(
    API_URL,
    fetcher
  );

  if (isLoading)
    return { links: {} as Record<string, LinkItem[]>, isLoading, error };

  const allLinks: LinkItem[] = [];

  data?.items.map((link: RaindropItem) => {
    const item: LinkItem = {
      href: link.link,
      title: link.note,
      imgSrc: link.cover,
      srclocal: false,
      urllocal: false,
      category: link.tags[0],
    };

    allLinks.push(item);
  });

  const linksByCategory = allLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, LinkItem[]>);

  return {
    links: linksByCategory as Record<string, LinkItem[]>,
    isLoading,
    error,
  };
}

const Links: React.FC = () => {
  const {
    links,
    isLoading,
    error,
  }: { links: Record<string, LinkItem[]>; isLoading: boolean; error: any } =
    useLinks();

  const renderLink = (
    { href, title, imgSrc, srclocal, urllocal }: LinkItem,
    key: number
  ) => (
    <div className={styles.cardLinkOuter} key={key}>
      <div className={styles.cardLinkInner}>
        <a
          href={href}
          className={`${styles.item} ${styles.sizesmall}`}
          target="_blank"
        >
          <div className={styles.tiletitle}>
            <span className={styles.text}>{title}</span>
          </div>
          <div>
            <Image
              src={imgSrc}
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
    links[category]?.map(renderLink) || null;

  const sections = useMemo(
    () =>
      sectionData.map((section) => ({
        title: section.title,
        value: section.value,
        icon: section.icon,
      })),
    []
  );

  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (isLoading) return <Spinner label="Loading" />;

  return (
    <div className={styles.accordion}>
      {sections.map((item, index) => (
        <div key={index} className={styles.accordionItem}>
          <button
            className={`${styles.accordionTitle} ${
              openIndex === index ? styles.open : ""
            }`}
            onClick={() => toggleAccordion(index)}
          >
            <div
              className={`${styles.accordionTitleText} ${
                openIndex === index ? styles.open : ""
              } flex items-center justify-between bg-gradient-to-t from-[var(--dark-blue)] to-[var(--accent-blue)] pt-3 pb-3`}
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
            <div className="grid grid-cols-3 pt-2 pr-2 pl-2">
              {renderLinks(item.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Links;
