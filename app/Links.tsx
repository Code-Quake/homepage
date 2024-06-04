import Image from "next/image";

interface ILink {
  href: string;
  imgSrc: string;
  title: string;
}

export default function Links() {
  const links = new Array<ILink>(
    {
      href: "https://www.gocomics.com/mycomics/1234614",
      imgSrc: "http://www.gocomics.com",
      title: "GoComics",
    },
    {
      href: "https://www.thefarside.com/",
      imgSrc: "http://www.thefarside.com/",
      title: "The Far side",
    },
    {
      href: "https://www.cnn.com/",
      imgSrc: "http://www.cnn.com/",
      title: "CNN",
    },
    {
      href: "https://www.npr.org/",
      imgSrc: "http://www.npr.org/",
      title: "NPR",
    },
    {
      href: "https://www.linkedin.com/",
      imgSrc: "http://www.linkedin.com/",
      title: "LinkedIn",
    },
    {
      href: "https://www.x.com/",
      imgSrc: "http://www.x.com/",
      title: "X",
    },
    {
      href: "https://www.jw.org/",
      imgSrc: "http://www.jw.org/",
      title: "JW.ORG",
    },
    {
      href: "https://wol.jw.org/en/wol/h/r1/lp-e",
      imgSrc: "http://wol.jw.org/",
      title: "WT Library",
    },
    {
      href: "https://www.ebay.com/",
      imgSrc: "http://www.ebay.com/",
      title: "eBay",
    },
    {
      href: "https://www.amazon.com/",
      imgSrc: "http://www.amazon.com/",
      title: "Amazon",
    },
    {
      href: "https://www.perplexity.ai/",
      imgSrc: "http://www.perplexity.ai/",
      title: "Perplexity",
    },
    {
      href: "https://www.github.com",
      imgSrc: "http://www.github.com",
      title: "GitHub",
    },
    {
      href: "https://dozzle.localhost",
      imgSrc: "http://dozzle.dev",
      title: "Dozzle",
    },
    {
      href: "https://portainer.codequake.local:9443",
      imgSrc: "http://www.portainer.io",
      title: "Portainer",
    },
    {
      href: "http://localhost:19999",
      imgSrc: "http://www.netdata.cloud",
      title: "Netdata",
    },
    {
      href: "http://localhost:9090",
      imgSrc: "https://cockpit-project.org",
      title: "Cockpit",
    },
    {
      href: "https://posd.uhaul.net",
      imgSrc: "https://www.uhaul.com",
      title: "POSD",
    },
    {
      href: "https://stage.webselfstorage.com/SignIn",
      imgSrc: "https://www.uhaul.com",
      title: "Web Self Storage",
    },
    {
      href: "https://kibanad.amerco.org",
      imgSrc: "https://www.elastic.co",
      title: "Kibana Dev",
    },
    {
      href: "https://kibana.amerco.org",
      imgSrc: "https://www.elastic.co",
      title: "Kibana Prod",
    }
  );

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
