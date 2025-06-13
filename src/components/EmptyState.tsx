import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { useStore } from '../store';

interface EmptyStateProps {
  title: string;
  description: string;
  showCreateButton?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  showCreateButton = true 
}) => {
  const { setIsCreatingNewNote } = useStore();
  
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-4">
        <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400 max-w-md">
        {description}
      </p>
      {showCreateButton && (
        <button
          onClick={() => setIsCreatingNewNote(true)}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={16} className="mr-1" />
          Create New Note
        </button>
      )}
    </div>
  );
};

export default EmptyState;