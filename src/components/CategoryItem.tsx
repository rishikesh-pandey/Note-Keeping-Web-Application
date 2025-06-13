import React from 'react';
import { Edit2, Folder, Trash2 } from 'lucide-react';
import { Category } from '../types';
import { useStore } from '../store';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
  noteCount: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  isSelected, 
  onSelect,
  noteCount,
}) => {
  const { removeCategory } = useStore();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      removeCategory(category.id);
    }
  };
  
  return (
    <li>
      <button
        onClick={onSelect}
        className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
          isSelected
            ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
      >
        <Folder size={16} className="mr-2" />
        <span className="flex-1 truncate">{category.name}</span>
        {noteCount > 0 && (
          <span className="ml-auto bg-gray-200 rounded-full px-2 py-0.5 text-xs dark:bg-gray-700">
            {noteCount}
          </span>
        )}
        <button
          onClick={handleDelete}
          className="ml-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          aria-label={`Delete ${category.name} category`}
        >
          <Trash2 size={14} />
        </button>
      </button>
    </li>
  );
};

export default CategoryItem;