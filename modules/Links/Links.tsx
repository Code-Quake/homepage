/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useMemo, useState } from "react";
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
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
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

const API_URL = "https://api.raindrop.io/rest/v1/raindrops/46913959";
const API_TOKEN = "4a69b609-f484-4fc9-8d8c-cd8df5bddc73";

const sectionData: SectionData[] = [
  { title: "Comics", value: "comics", icon: faPersonFallingBurst },
  { title: "Updates", value: "updates", icon: faNewspaper },
  { title: "UHaul", value: "uhaul", icon: faTruckMoving },
  { title: "Shopping", value: "shopping", icon: faCartShopping },
  { title: "Development", value: "development", icon: faComputer },
  { title: "Admin", value: "admin", icon: faGears },
];

interface UseLinksResult {
  links: Record<string, LinkItem[]>;
  isLoading: boolean;
  error: any;
}


function useLinks(): UseLinksResult {
const fetcher = (url: string) =>
  axios
    .get(url, { headers: { Authorization: `Bearer ${API_TOKEN}` } })
    .then((res) => res.data);

  const { data, isLoading, error } = useSWR<RaindropResponse, boolean, any>(
    API_URL,
    fetcher
  );

  const links = useMemo(() => {
    if (!data) return {};
    return data.items.reduce((acc, link: RaindropItem) => {
      const category = link.tags[0];
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        href: link.link,
        title: link.note,
        imgSrc: link.cover,
        srclocal: false,
        urllocal: false,
        category,
      });
      return acc;
    }, {} as Record<string, LinkItem[]>);
  }, [data]);

  return {
    links: links,
    isLoading,
    error,
  };
}

const Links: React.FC = () => {
  const { links, isLoading, error }: UseLinksResult = useLinks();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const renderLink = (
    { href, title, imgSrc, srclocal, urllocal }: LinkItem,
    key: number
  ) => (
    <div className={styles.cardLinkOuter} key={key}>
      <div className={styles.cardLinkInner}>
        <a
          href={href}
          className="grow cursor-pointer flex flex-row-reverse items-center"
          target="_blank"
        >
          <div className="text-left w-full">
            <span
              className={`${styles.underline} ml-2 text-[var(--primary-fuchsia)]`}
            >
              {title}
            </span>
          </div>
        </a>
        <div className="ml-1 relative w-[23px] h-[23px]">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover rounded-full"
            unoptimized
          />
        </div>
      </div>
    </div>
  );

  if (isLoading) return <Spinner label="Loading" />;

  if (error) return <h1>Error {error}</h1>

  return (
    <div className={styles.accordion}>
      {sectionData.map(({ title, value, icon }, index) => (
        <div key={index} className={styles.accordionItem}>
          <button
            className={`${styles.accordionTitle} ${
              openIndex === index ? styles.open : ""
            }`}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div
              className={`${styles.accordionTitleText} ${
                openIndex === index ? styles.open : ""
              } flex items-center justify-between bg-gradient-to-t from-[var(--dark-blue)] to-[var(--accent-blue)] pt-3 pb-3`}
            >
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={icon as IconDefinition}
                  role="button"
                  className="pl-2.5 text-xl pr-2.5"
                />
                {title}
              </div>
              <div
                className={`${styles.accordionButton} ${
                  openIndex === index ? styles.open : ""
                } float-end flex mr-2`}
              />
            </div>
          </button>
          <div
            className={`${styles.accordionContent} ${
              openIndex === index ? styles.open : ""
            } pl-[0.15rem] pr-[0.15rem]`}
          >
            <div className="grid grid-cols-3 pt-2 pr-2 pl-2">
              {links[value]?.map(renderLink)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Links;
