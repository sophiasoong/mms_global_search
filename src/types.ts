export interface NavItem {
  title: string;
  icon?: string;
  href?: string;
  items?: NavItem[];
}

export interface Order {
  id: string;
  type: string;
  status: string;
  destination: string;
  time: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  testId: string;
}

export interface Promotion {
  id: string;
  name: string;
  status: string;
  code: string;
  date: string;
}

export interface PageLink {
  id: string;
  title: string;
}

export type SearchResultType = 'Product' | 'Promotion' | 'Page Link' | 'Order';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  metadata?: string[];
  relevance: number;
  originalData: any;
}
