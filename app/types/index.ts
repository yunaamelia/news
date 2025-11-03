import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  authorImage?: string;
  isPremium: boolean;
  views: number;
  publishedAt?: Date | string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
  lastUpdated: string;
}

export interface Comment {
  id: string;
  content: string;
  articleId: string;
  userId: string;
  parentId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
  replies?: Comment[];
}

export interface Watchlist {
  id: string;
  userId: string;
  symbol: string;
  assetType: "SAHAM" | "KRIPTO";
  name: string;
  addedAt: Date | string;
}

export interface Portfolio {
  id: string;
  userId: string;
  symbol: string;
  assetType: "SAHAM" | "KRIPTO";
  name: string;
  quantity: number;
  buyPrice: number;
  buyDate: Date | string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Newsletter {
  id: string;
  email: string;
  userId?: string;
  isActive: boolean;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  subscribedAt: Date | string;
}

export type AssetType = "SAHAM" | "KRIPTO";

export type ArticleCategory =
  | "SAHAM"
  | "KRIPTO"
  | "ANALISIS"
  | "EDUKASI"
  | "REGULASI"
  | "TEKNOLOGI";

export type UserRole = "USER" | "EDITOR" | "ADMIN";
