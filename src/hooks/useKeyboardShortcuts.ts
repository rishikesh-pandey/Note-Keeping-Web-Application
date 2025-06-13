import { useEffect } from 'react';
import { useStore } from '../store';
import toast from 'react-hot-toast';

export const useKeyboardShortcuts = () => {
  const { 
    setIsCreatingNewNote,
    activeNote,
    updateNote,
    toggleDarkMode,
    toggleSidebar
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        try {
          switch (e.key) {
            case 'n':
              e.preventDefault();
              setIsCreatingNewNote(true);
              toast.success('Creating new note');
              break;
              
            case 's':
              e.preventDefault();
              if (activeNote) {
                updateNote(activeNote.id, activeNote);
                toast.success('Note saved');
              }
              break;
              
            case 'b':
              e.preventDefault();
              toggleSidebar();
              toast.success('Toggled sidebar');
              break;
              
            case 'd':
              e.preventDefault();
              toggleDarkMode();
              toast.success('Toggled dark mode');
              break;
          }
        } catch (error) {
          console.error('Keyboard shortcut error:', error);
          toast.error('Failed to execute keyboard shortcut');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNote, setIsCreatingNewNote, updateNote, toggleDarkMode, toggleSidebar]);
};