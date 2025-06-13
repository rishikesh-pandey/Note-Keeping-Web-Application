import React from 'react';
import { FileText, Star, Trash2, Menu } from 'lucide-react';
import { useStore } from '../store';

const MobileNavigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    setSelectedCategory,
    setSelectedTag,
    notes,
    trashedNotes,
  } = useStore();
  
  const favoriteNotesCount = notes.filter(note => note.isFavorite).length;
  
  const handleTabClick = (tab: 'notes' | 'favorites' | 'trash') => {
    setActiveTab(tab);
    setSelectedCategory(null);
    setSelectedTag(null);
    setIsMobileMenuOpen(false);
  };
  
  return (
    <div className="block md:hidden">
      {/* Mobile menu (when opened) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute bottom-16 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-xl shadow-xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>
            
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleTabClick('notes')}
                  className={`flex w-full items-center rounded-md px-4 py-3 text-sm ${
                    activeTab === 'notes'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <FileText size={20} className="mr-3" />
                  <span className="font-medium">All Notes</span>
                  <span className="ml-auto bg-gray-200 rounded-full px-2 py-0.5 text-xs dark:bg-gray-700">
                    {notes.length}
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('favorites')}
                  className={`flex w-full items-center rounded-md px-4 py-3 text-sm ${
                    activeTab === 'favorites'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Star size={20} className="mr-3" />
                  <span className="font-medium">Favorites</span>
                  {favoriteNotesCount > 0 && (
                    <span className="ml-auto bg-gray-200 rounded-full px-2 py-0.5 text-xs dark:bg-gray-700">
                      {favoriteNotesCount}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('trash')}
                  className={`flex w-full items-center rounded-md px-4 py-3 text-sm ${
                    activeTab === 'trash'
                      ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Trash2 size={20} className="mr-3" />
                  <span className="font-medium">Trash</span>
                  {trashedNotes.length > 0 && (
                    <span className="ml-auto bg-gray-200 rounded-full px-2 py-0.5 text-xs dark:bg-gray-700">
                      {trashedNotes.length}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex justify-around">
          <button
            onClick={() => handleTabClick('notes')}
            className={`flex flex-1 flex-col items-center py-3 ${
              activeTab === 'notes'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FileText size={20} />
            <span className="text-xs mt-1">Notes</span>
          </button>
          <button
            onClick={() => handleTabClick('favorites')}
            className={`flex flex-1 flex-col items-center py-3 ${
              activeTab === 'favorites'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Star size={20} />
            <span className="text-xs mt-1">Favorites</span>
          </button>
          <button
            onClick={() => handleTabClick('trash')}
            className={`flex flex-1 flex-col items-center py-3 ${
              activeTab === 'trash'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Trash2 size={20} />
            <span className="text-xs mt-1">Trash</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-1 flex-col items-center py-3 text-gray-600 dark:text-gray-400"
          >
            <Menu size={20} />
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
      </div>
      
      {/* Space to prevent content from being hidden behind the navigation */}
      <div className="h-16"></div>
    </div>
  );
};

export default MobileNavigation;