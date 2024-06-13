import Image from "next/image";
import links from "../../data/links.json";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";

const Links = (): JSX.Element => {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3">
      {links.map(({ href, title, imgSrc }, key) => (
        <HoverBorderGradient key={key}>
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="item size-small"
          >
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
          </a>
        </HoverBorderGradient>
      ))}
    </div>
  );
};

export default Links;