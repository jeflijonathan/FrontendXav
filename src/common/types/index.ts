import type { AxiosError } from "axios";
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
export type CommonOptions = {
  value: number | string | boolean;
  icon?: string;
  label: string;
};
export type FilterType = {
  key: string;
  label: string;
  options: CommonOptions[];
};

export interface MenuItemType {
  icon: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  subItems?: SubItemType[];
}

export type PaginationType = {
  total_data: number,
  page: number,
  limit: number,
  total_pages: number,
  has_next: boolean | string,
  has_prev: boolean | string
};

export type APIResponse<T = void> = {
  status: string;
  status_code: number;
  message: string;
  data: T;
  details?: string[];
};

export type DataWithPagination<T> = {
  data: T;
  pagination: PaginationType;
};

export type FetchCallback<T> = {
  onSuccess: (data: T) => void;
  onError: ({ detail, message }: ErrorType) => void;
  onFullfilled?: () => void;
};

export type ErrorType = { detail?: string[], message?: string }

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