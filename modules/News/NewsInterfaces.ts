export interface IArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface IResponse {
  status: string;
  totalResults: number;
  articles: IArticle[];
}

export interface INewsCard {
  id: number;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  newsSource: string;
}

export interface INewsCard2 {
  id: number;
  description: string;
  title: string;
  src: string;
  ctaText: string;
  ctaLink: string;
  content: any;
  newsSource: string;
}

export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface RssFeed {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RssItem[];
  }[];
}
