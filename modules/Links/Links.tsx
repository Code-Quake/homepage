import Image from "next/image";
import links from "../../data/links.json";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";
import { LinkPreview } from "../ui/LinkPreview";
import { Div } from "@/modules/ui/MovingBorder";

const Links = (): JSX.Element => {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
      {links.map(({ href, title, imgSrc }, key) => (
        <Div
          key={key}
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 clock"
          style={{
            height: "fit-content",
            width: "100%",
          }}
        >
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
        </Div>
      ))}
    </div>
  );
};

export default Links;
