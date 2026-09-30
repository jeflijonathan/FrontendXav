import type { ReactNode } from "react";

export interface ThemeProperties {
  [key: string]: string;
}

export interface Definitions {
  [theme: string]: ThemeProperties;
}

export interface SubItemType {
  label: string;
  href: string;
}

export interface MenuItemType {
  icon: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  subItems?: SubItemType[];
}

// ── API Types ──────────────────────────────────────────────

export type PaginationType = {
  page: number;
  limit: number;
  total_data: number;
  total_pages: number;
};

export type APIResponse<T = void> = {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  pagination: PaginationType;
};

export type DataWithPagination<T> = {
  data: T;
  pagination: PaginationType;
};

export type FetchCallback<T> = {
  onSuccess: (data: T) => void;
  onError: (error: any) => void;
  onFullfilled?: () => void;
};

export type FilterParams = {
  params: {
    [key: string]:
    | string
    | number
    | undefined
    | string[]
    | number[]
    | boolean
    | null;
  };
};

export type SortOptionType = {
  label: string;
  value: string;
}