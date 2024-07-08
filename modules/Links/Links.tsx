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
  category: string;
}

const Links: React.FC = () => {

interface TabData {
  title: string;
  value: string;
}

const tabData: TabData[] = [
  { title: "Comics", value: "comics" },
  { title: "News", value: "news" },
  { title: "Social", value: "social" },
  { title: "UHaul", value: "uhaul" },
  { title: "Shopping", value: "shopping" },
  { title: "Development", value: "development" },
  { title: "Admin", value: "admin" },
];

const renderTabContent = ({
  title,
  value,
}: TabData): React.ReactNode => (
  <div className="w-full overflow-hidden relative h-full rounded-2xl linksTile">
        <h2 className="linksTitle pl-5">{title}</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 linksGrid">
          {renderLinks(value)}
        </div>
  </div>
);

interface Tab {
  title: string;
  value: string;
  content: React.ReactNode;
}

const tabs: Tab[] = tabData.map((tab) => ({
  title: tab.title,
  value: tab.value,
  content: renderTabContent(tab),
}));

// Assuming renderLinks is defined elsewhere
function renderLinks(cat: string): React.ReactNode {
  // Implementation of renderLinks
    return links.map(
      ({ href, title, imgSrc, srclocal, category }: LinkItem, key: number) =>
        category === cat && (
          <HoverBorderGradient key={key}>
            <LinkPreview url={href} className="item size-small">
              <div className="tile-title">
                <span className="text">{title}</span>
              </div>
              <div>
                <Image
                  src={
                    srclocal
                      ? imgSrc
                      : `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${imgSrc}&size=32`
                  }
                  alt={title}
                  width={32}
                  height={32}
                  unoptimized
                />
              </div>
            </LinkPreview>
          </HoverBorderGradient>
        )
    );
}

  return (
    <div className="h-[18rem] md:h-[37rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default Links;
