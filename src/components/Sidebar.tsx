import React from 'react';
import { Trash2, Star, FileText, Plus } from 'lucide-react';
import { useStore } from '../store';

const Sidebar: React.FC = () => {
  const {
    categories,
    tags,
    selectedCategory,
    selectedTag,
    setSelectedCategory,
    setSelectedTag,
    notes,
    addCategory,
    addTag
  } = useStore();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleTagClick = (tagId: string) => {
    setSelectedTag(tagId === selectedTag ? null : tagId);
  };

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 p-4">
      {/* Categories */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Categories</h2>
          <button 
            onClick={() => addCategory({ name: prompt('Enter category name:') || '' })}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Plus size={20} />
          </button>
        </div>
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`
              cursor-pointer p-2 rounded mb-1 flex items-center
              ${selectedCategory === category.id 
                ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
            `}
          >
            <span className="mr-2">{category.name}</span>
            <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              {notes.filter(note => note.category === category.id).length}
            </span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Tags</h2>
          <button 
            onClick={() => addTag({ 
              name: prompt('Enter tag name:') || '',
              color: '#' + Math.floor(Math.random()*16777215).toString(16)
            })}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Plus size={20} />
          </button>
        </div>
        {tags.map(tag => (
          <div
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`
              cursor-pointer p-2 rounded mb-1 flex items-center
              ${selectedTag === tag.id 
                ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
            `}
          >
            <span 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: tag.color }}
            />
            <span>{tag.name}</span>
            <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              {notes.filter(note => note.tags.includes(tag.id)).length}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;