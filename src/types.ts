export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export type ViewMode = 'list' | 'grid';
export type Theme = 'light' | 'dark' | 'system';

export interface SearchFilters {
  query: string;
  tags: string[];
  categories: string[];
  favoritesOnly: boolean;
  pinnedOnly: boolean;
  sortBy: 'updatedAt' | 'createdAt' | 'title';
  sortDirection: 'asc' | 'desc';
}

export type SidebarTab = 'notes' | 'favorites' | 'trash';