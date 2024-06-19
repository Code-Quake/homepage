import Image from "next/image";
import links from "../../data/links.json";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";
import { LinkPreview } from "../ui/LinkPreview";

const Links = (): JSX.Element => {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3 linksGrid">
      {links.map(({ href, title, imgSrc }, key) => (
        <HoverBorderGradient key={key}>
          <LinkPreview url={href} className="item size-small">
            <div className="tile-title">
              <span className="text">{title}</span>
            </div>
            <div>
              <Image
                src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${imgSrc}&size=32`}
                alt="Comics"
                width={32}
                height={32}
                unoptimized
              />
            </div>
          </LinkPreview>
        </HoverBorderGradient>
      ))}
    </div>
  );
};

export default Links;
