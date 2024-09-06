const keys = require("./keys.json");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/book/:book/:chapter",
        destination: "https://wol.jw.org/wol/b/r1/lp-e/nwtsty/:book/:chapter",
      },
      {
        source: "/meetings/:slug*",
        destination: "https://wol.jw.org/en/wol/meetings/r1/lp-e/:slug*",
      },
      {
        source: "/text/:slug*",
        destination: "https://wol.jw.org/en/wol/h/r1/lp-e/:slug*",
      },
      {
        source: "/scripture/:slug*",
        destination: "https://wol.jw.org/:slug*",
      },
      {
        source: "/jwnewsRSS",
        destination: "https://www.jw.org/en/news/rss/FullNewsRSS/feed.xml",
      },
      {
        source: "/news",
        destination:
          `https://newsapi.org/v2/top-headlines?sources=cnn&apiKey=${keys.keys.news}`,
      },
    ];
  },
  //output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);


