import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface RaindropItem {
  _id: number;
  link: string;
  title: string;
  excerpt: string;
  note: string;
  type: string;
  user: {
    $ref: string;
    $id: number;
  };
  cover: string;
  media: Array<{
    type: string;
    link: string;
  }>;
  tags: string[];
  important: boolean;
  removed: boolean;
  created: string;
  collection: {
    $ref: string;
    $id: number;
    oid: number;
  };
  highlights: any[];
  lastUpdate: string;
  domain: string;
  creatorRef: {
    _id: number;
    name: string;
    avatar: string;
    email: string;
  };
  sort: number;
  collectionId: number;
}

export interface RaindropResponse {
  result: boolean;
  items: RaindropItem[];
}

export interface LinkItem {
  href: string;
  title: string;
  imgSrc: string;
  srclocal: boolean;
  urllocal: boolean;
  category: string;
}

export interface SectionData {
  title: string;
  value: string;
  icon: IconProp;
}
