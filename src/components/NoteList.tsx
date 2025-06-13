import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Pin, Star, StarOff, Copy, Trash2 } from 'lucide-react';
import { Note, ViewMode } from '../types';
import { useStore } from '../store';
import EmptyState from './EmptyState';

interface NoteListProps {
  viewMode: ViewMode;
}

const NoteList: React.FC<NoteListProps> = ({ viewMode }) => {
  const { 
    notes, 
    trashedNotes,
    activeNote, 
    setActiveNote, 
    togglePinNote, 
    toggleFavoriteNote, 
    deleteNote,
    restoreNote,
    permanentlyDeleteNote,
    activeTab,
    searchFilters,
    selectedCategory,
    selectedTag,
  } = useStore();
  
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  
  // Apply filters and sorting to notes
  useEffect(() => {
    let result = activeTab === 'trash' ? [...trashedNotes] : [...notes];
    
    if (activeTab === 'favorites') {
      result = result.filter(note => note.isFavorite);
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(note => note.category === selectedCategory);
    }
    
    // Apply tag filter
    if (selectedTag) {
      result = result.filter(note => note.tags.includes(selectedTag));
    }
    
    // Apply search filters
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      result = result.filter(
        note => 
          note.title.toLowerCase().includes(query) || 
          note.content.toLowerCase().includes(query)
      );
    }
    
    if (searchFilters.tags.length > 0) {
      result = result.filter(note => 
        searchFilters.tags.some(tag => note.tags.includes(tag))
      );
    }
    
    if (searchFilters.categories.length > 0) {
      result = result.filter(note => 
        searchFilters.categories.includes(note.category)
      );
    }
    
    if (searchFilters.favoritesOnly) {
      result = result.filter(note => note.isFavorite);
    }
    
    if (searchFilters.pinnedOnly) {
      result = result.filter(note => note.isPinned);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const valueA = a[searchFilters.sortBy];
      const valueB = b[searchFilters.sortBy];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return searchFilters.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    });
    
    // Always put pinned notes at the top (unless in trash)
    if (activeTab !== 'trash') {
      const pinned = result.filter(note => note.isPinned);
      const unpinned = result.filter(note => !note.isPinned);
      result = [...pinned, ...unpinned];
    }
    
    setFilteredNotes(result);
  }, [
    notes, 
    trashedNotes, 
    activeTab, 
    searchFilters, 
    selectedCategory, 
    selectedTag
  ]);
  
  // Helper to get note preview text (without HTML tags)
  const getNotePreview = (content: string) => {
    // Strip HTML tags
    const textOnly = content.replace(/<[^>]*>?/gm, '');
    return textOnly.length > 100 ? textOnly.slice(0, 100) + '...' : textOnly;
  };
  
  if (filteredNotes.length === 0) {
    return (
      <EmptyState 
        title={activeTab === 'trash' ? 'Trash is empty' : 'No notes found'} 
        description={activeTab === 'trash' 
          ? 'Your deleted notes will appear here'
          : 'Try creating a new note or changing your filters'
        }
      />
    );
  }
  
  return (
    <div className="h-full overflow-y-auto p-4">
      {activeTab === 'trash' && (
        <div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Notes in trash will be permanently deleted after 30 days.
        </div>
      )}
      
      {viewMode === 'list' ? (
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`group cursor-pointer rounded-md border p-3 transition-all ${
                activeNote?.id === note.id
                  ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
                  : 'border-gray-200 bg-white hover:border-indigo-200 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-indigo-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white truncate flex-1">
                  {note.title || 'Untitled Note'}
                </h3>
                <div className="flex items-center space-x-1 ml-2">
                  {activeTab !== 'trash' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinNote(note.id);
                        }}
                        className={`p-1 ${
                          note.isPinned 
                            ? 'text-amber-500 dark:text-amber-400' 
                            : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-400'
                        }`}
                        aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
                      >
                        <Pin size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteNote(note.id);
                        }}
                        className={`p-1 ${
                          note.isFavorite 
                            ? 'text-indigo-500 dark:text-indigo-400' 
                            : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400'
                        }`}
                        aria-label={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {note.isFavorite ? <Star size={16} /> : <StarOff size={16} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        aria-label="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  
                  {activeTab === 'trash' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreNote(note.id);
                        }}
                        className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400"
                        aria-label="Restore note"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Permanently delete this note? This action cannot be undone.')) {
                            permanentlyDeleteNote(note.id);
                          }
                        }}
                        className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        aria-label="Permanently delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {getNotePreview(note.content)}
              </p>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 2).map((tagId) => (
                    <span
                      key={tagId}
                      className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                    >
                      {tagId}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      +{note.tags.length - 2}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`group cursor-pointer rounded-md border p-4 transition-all flex flex-col h-64 ${
                activeNote?.id === note.id
                  ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20'
                  : 'border-gray-200 bg-white hover:border-indigo-200 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-indigo-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white truncate flex-1">
                  {note.title || 'Untitled Note'}
                </h3>
                <div className="flex items-center space-x-1 ml-2">
                  {activeTab !== 'trash' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinNote(note.id);
                        }}
                        className={`p-1 ${
                          note.isPinned 
                            ? 'text-amber-500 dark:text-amber-400' 
                            : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-400'
                        }`}
                        aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
                      >
                        <Pin size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavoriteNote(note.id);
                        }}
                        className={`p-1 ${
                          note.isFavorite 
                            ? 'text-indigo-500 dark:text-indigo-400' 
                            : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400'
                        }`}
                        aria-label={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {note.isFavorite ? <Star size={16} /> : <StarOff size={16} />}
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex-1 overflow-hidden">
                {getNotePreview(note.content)}
              </p>
              
              <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 2).map((tagId) => (
                    <span
                      key={tagId}
                      className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                    >
                      {tagId}
                    </span>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      +{note.tags.length - 2}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </span>
              </div>
              
              {activeTab !== 'trash' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="absolute top-2 right-2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  aria-label="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              ) : (
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreNote(note.id);
                    }}
                    className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400"
                    aria-label="Restore note"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Permanently delete this note? This action cannot be undone.')) {
                        permanentlyDeleteNote(note.id);
                      }
                    }}
                    className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    aria-label="Permanently delete note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;