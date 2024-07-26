"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import links from "../../data/links.json";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";

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

  return (
    <div className="w-full p-2">
      <Accordion
        variant="bordered"
        defaultExpandedKeys={["Comics"]}
        isCompact
        className="pr-3 pl-3 pt-1 pb-1"
      >
        {tabs.map((tab) => (
          <AccordionItem
            className="pt-1 pb-1"
            key={tab.title}
            aria-label={tab.title}
            title={tab.title}
            startContent={
              <Avatar isBordered color="primary" radius="lg" src={tab.icon} />
            }
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 linksGrid">
              {renderLinks(tab.value)}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Links;
