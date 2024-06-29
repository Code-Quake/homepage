import React, { useMemo } from "react";
import Image from "next/image";
import links from "../../data/links.json";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";
import { LinkPreview } from "../ui/LinkPreview";

interface LinkItem {
  href: string;
  title: string;
  imgSrc: string;
  srclocal: boolean;
}

const Links: React.FC = () => {
  const renderLinks = useMemo(() => {
    return links.map(
      ({ href, title, imgSrc, srclocal }: LinkItem, key: number) => (
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
  }, []);

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3 linksGrid">
      {renderLinks}
    </div>
  );
};

export default Links;
