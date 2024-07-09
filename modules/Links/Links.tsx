import React, { useMemo } from "react";
import Image from "next/image";
import links from "../../data/links.json";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";
import { LinkPreview } from "../ui/LinkPreview";
import { Tabs } from "../ui/AnimatedTabs";

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
}

const tabData: TabData[] = [
  { title: "Comics", value: "comics" },
  { title: "Updates", value: "updates" },
  { title: "UHaul", value: "uhaul" },
  { title: "Shopping", value: "shopping" },
  { title: "Development", value: "development" },
  { title: "Admin", value: "admin" },
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
    <HoverBorderGradient key={key}>
      {!urllocal && (
        <LinkPreview url={href} className="item size-small">
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
        </LinkPreview>
      )}{" "}
      {urllocal && (
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
      )}
    </HoverBorderGradient>
  );

  const renderLinks = (category: string) =>
    linksByCategory[category]?.map(renderLink) || null;

  const renderTabContent = ({ title, value }: TabData): React.ReactNode => (
    <div className="w-full overflow-hidden relative h-full rounded-2xl linksTile">
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 linksGrid">
        {renderLinks(value)}
      </div>
    </div>
  );

  const tabs = useMemo(
    () =>
      tabData.map((tab) => ({
        title: tab.title,
        value: tab.value,
        content: renderTabContent(tab),
      })),
    []
  );

  return (
    <div className="h-[18rem] md:h-[37rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default Links;
