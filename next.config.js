const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
 
/** @type {import('next').NextConfig} */
 
const nextConfig = {
  async rewrites() {
    return [
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
        source: "/jwnews",
        destination: "https://www.jw.org/en/news",
      },
    ];
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "t2.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github-readme-stats.vercel.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);