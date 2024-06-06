import Image from "next/image";
import links from "../data/links.json";

export default function Links() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3">
      {links.map(({ href, title, imgSrc }, key) => (
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
      ))}
    </div>
  );
}
