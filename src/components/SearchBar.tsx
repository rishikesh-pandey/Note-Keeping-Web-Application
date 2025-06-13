import React, { useState } from 'react';
import { Search, X, ArrowDownAZ, ArrowUpAZ, Tag, Folder, Star, Pin } from 'lucide-react';
import { useStore } from '../store';

interface SearchBarProps {
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const { 
    searchFilters, 
    setSearchFilters, 
    categories, 
    tags 
  } = useStore();
  
  const [query, setQuery] = useState(searchFilters.query);
  
  const handleSearch = () => {
    setSearchFilters({ query });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };
  
  const toggleSortDirection = () => {
    setSearchFilters({ 
      sortDirection: searchFilters.sortDirection === 'asc' ? 'desc' : 'asc' 
    });
  };
  
  const toggleCategoryFilter = (categoryId: string) => {
    setSearchFilters({
      categories: searchFilters.categories.includes(categoryId)
        ? searchFilters.categories.filter(id => id !== categoryId)
        : [...searchFilters.categories, categoryId]
    });
  };
  
  const toggleTagFilter = (tagId: string) => {
    setSearchFilters({
      tags: searchFilters.tags.includes(tagId)
        ? searchFilters.tags.filter(id => id !== tagId)
        : [...searchFilters.tags, tagId]
    });
  };
  
  const toggleFavoritesOnly = () => {
    setSearchFilters({ favoritesOnly: !searchFilters.favoritesOnly });
  };
  
  const togglePinnedOnly = () => {
    setSearchFilters({ pinnedOnly: !searchFilters.pinnedOnly });
  };
  
  const clearFilters = () => {
    setSearchFilters({
      query: '',
      tags: [],
      categories: [],
      favoritesOnly: false,
      pinnedOnly: false,
      sortBy: 'updatedAt',
      sortDirection: 'desc',
    });
    setQuery('');
  };
  
  return (
    <div className="flex flex-col">
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Search notes..."
          autoFocus
        />
        {query && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => {
              setQuery('');
              setSearchFilters({ query: '' });
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Filters section */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleFavoritesOnly}
              className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                searchFilters.favoritesOnly 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <Star size={14} className="mr-1" />
              Favorites
            </button>
            
            <button
              onClick={togglePinnedOnly}
              className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                searchFilters.pinnedOnly 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <Pin size={14} className="mr-1" />
              Pinned
            </button>
            
            <button
              onClick={() => setSearchFilters({ sortBy: 'updatedAt' })}
              className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                searchFilters.sortBy === 'updatedAt' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              Recently Updated
            </button>
            
            <button
              onClick={() => setSearchFilters({ sortBy: 'createdAt' })}
              className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                searchFilters.sortBy === 'createdAt' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              Recently Created
            </button>
            
            <button
              onClick={() => setSearchFilters({ sortBy: 'title' })}
              className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                searchFilters.sortBy === 'title' 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              Title
            </button>
            
            <button
              onClick={toggleSortDirection}
              className="flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            >
              {searchFilters.sortDirection === 'asc' 
                ? <ArrowUpAZ size={14} className="mr-1" /> 
                : <ArrowDownAZ size={14} className="mr-1" />
              }
              {searchFilters.sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>
        </div>
        
        {/* Categories section */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategoryFilter(category.id)}
                className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  searchFilters.categories.includes(category.id) 
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <Folder size={14} className="mr-1" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tags section */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTagFilter(tag.id)}
                className={`flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  searchFilters.tags.includes(tag.id) 
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}
                style={{
                  backgroundColor: searchFilters.tags.includes(tag.id) ? `${tag.color}20` : undefined,
                  color: searchFilters.tags.includes(tag.id) ? tag.color : undefined,
                }}
              >
                <Tag size={14} className="mr-1" />
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear all filters
        </button>
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleSearch();
              onClose();
            }}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;