import React, { useState } from 'react';
import { Menu, X, Plus, Search, Moon, Sun, Grid, List } from 'lucide-react';
import { useStore } from '../store';
import SearchBar from './SearchBar';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { 
    toggleSidebar, 
    setIsCreatingNewNote, 
    viewMode, 
    setViewMode,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useStore();
  
  const { theme, setTheme, isDark } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const handleThemeToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };
  
  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return isDark ? <Moon size={20} /> : <Sun size={20} />;
  };
  
  const getThemeTitle = () => {
    if (theme === 'light') return 'Switch to dark mode';
    if (theme === 'dark') return 'Switch to system mode';
    return 'Switch to light mode';
  };
  
  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 transition-colors duration-200">
      {/* Left */}
      <div className="flex items-center">
        <button
          onClick={() => toggleSidebar()}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hidden md:block transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notes</h1>
      </div>
      
      {/* Right */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          aria-label={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
        >
          {viewMode === 'list' ? <Grid size={20} /> : <List size={20} />}
        </button>
        
        <button
          onClick={handleThemeToggle}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          aria-label={getThemeTitle()}
          title={getThemeTitle()}
        >
          {getThemeIcon()}
        </button>
        
        <button
          onClick={() => setIsCreatingNewNote(true)}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 ml-2 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          New Note
        </button>
      </div>
      
      {/* Search Bar (expanded) */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-full z-10 mt-1 animate-slideDown bg-white p-4 shadow-lg dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        </div>
      )}
      
      {/* Keyboard Shortcuts (desktop) */}
      <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <span>⌘/Ctrl + N: New Note</span>
        <span>⌘/Ctrl + S: Save</span>
        <span>⌘/Ctrl + B: Toggle Sidebar</span>
        <span>⌘/Ctrl + D: Toggle Dark Mode</span>
      </div>
    </header>
  );
};

export default Header;