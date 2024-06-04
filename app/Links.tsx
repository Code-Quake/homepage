import Image from "next/image";

interface ILink {
  href: string;
  imgSrc: string;
  title: string;
}

export default function Links() {
  const links = new Array<ILink>();

  links.push({
    href: "https://www.gocomics.com/mycomics/1234614",
    imgSrc: "http://www.gocomics.com",
    title: "GoComics",
  });

  links.push({
    href: "https://www.thefarside.com/",
    imgSrc: "http://www.thefarside.com/",
    title: "The Far side",
  });

  links.push({
    href: "https://www.cnn.com/",
    imgSrc: "http://www.cnn.com/",
    title: "CNN",
  });

  links.push({
    href: "https://www.npr.org/",
    imgSrc: "http://www.npr.org/",
    title: "NPR",
  });

  links.push({
    href: "https://www.linkedin.com/",
    imgSrc: "http://www.linkedin.com/",
    title: "LinkedIn",
  });

  links.push({
    href: "https://www.x.com/",
    imgSrc: "http://www.x.com/",
    title: "X",
  });

  links.push({
    href: "https://www.jw.org/",
    imgSrc: "http://www.jw.org/",
    title: "JW.ORG",
  });

  links.push({
    href: "https://wol.jw.org/en/wol/h/r1/lp-e",
    imgSrc: "http://wol.jw.org/",
    title: "WT Library",
  });

  links.push({
    href: "https://www.ebay.com/",
    imgSrc: "http://www.ebay.com/",
    title: "eBay",
  });

  links.push({
    href: "https://www.amazon.com/",
    imgSrc: "http://www.amazon.com/",
    title: "Amazon",
  });

  links.push({
    href: "https://www.perplexity.ai/",
    imgSrc: "http://www.perplexity.ai/",
    title: "Perplexity",
  });

  links.push({
    href: "https://www.github.com",
    imgSrc: "http://www.github.com",
    title: "GitHub",
  });

  links.push({
    href: "https://dozzle.localhost",
    imgSrc: "http://dozzle.dev",
    title: "Dozzle",
  });

  links.push({
    href: "https://portainer.codequake.local:9443",
    imgSrc: "http://www.portainer.io",
    title: "Portainer",
  });

  links.push({
    href: "http://localhost:19999",
    imgSrc: "http://www.netdata.cloud",
    title: "Netdata",
  });

  links.push({
    href: "http://localhost:9090",
    imgSrc: "https://cockpit-project.org",
    title: "Cockpit",
  });

  links.push({
    href: "https://posd.uhaul.net",
    imgSrc: "https://www.uhaul.com",
    title: "POSD",
  });

  links.push({
    href: "https://stage.webselfstorage.com/SignIn",
    imgSrc: "https://www.uhaul.com",
    title: "Web Self Storage",
  });

  links.push({
    href: "https://kibanad.amerco.org",
    imgSrc: "https://www.elastic.co",
    title: "Kibana Dev",
  });

  links.push({
    href: "https://kibana.amerco.org",
    imgSrc: "https://www.elastic.co",
    title: "Kibana Prod",
  });

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3">
      {links.map((link, key) => {
        return (
          <div key={key}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="item size-small"
            >
              <div className="tile-title">
                <span className="text">{link.title}</span>
              </div>
              <div>
                <Image
                  src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.imgSrc}&size=32`}
                  alt="Comics"
                  width={32}
                  height={32}
                />
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
}
