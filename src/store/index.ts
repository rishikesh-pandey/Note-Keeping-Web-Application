import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Category, Tag } from '../types';

interface StoreState {
  notes: Note[];
  trashedNotes: Note[];
  categories: Category[];
  tags: Tag[];
  activeNote: Note | null;
  activeNoteHistory: string[];
  isSidebarOpen: boolean;
  isCreatingNewNote: boolean;
  isDarkMode: boolean;
  theme: 'light' | 'dark' | 'system';
  searchFilters: {
    query: string;
    tags: string[];
    categories: string[];
    favoritesOnly: boolean;
    pinnedOnly: boolean;
    sortBy: keyof Note;
    sortDirection: 'asc' | 'desc';
  };
  selectedCategory: string | null;
  selectedTag: string | null;
  viewMode: 'list' | 'grid';
  activeTab: 'notes' | 'trash' | 'settings';
  isMobileMenuOpen: boolean;
  initialized: boolean;
  
  // Actions
  initializeApp: () => void;
  setActiveNote: (note: Note | null) => void;
  createNote: (note: Partial<Note>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;
  addCategory: (category: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  addTag: (tag: Partial<Tag>) => void;
  removeTag: (id: string) => void;
  setSearchFilters: (filters: Partial<StoreState['searchFilters']>) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedTag: (tagId: string | null) => void;
  setViewMode: (mode: 'list' | 'grid') => void;
  setActiveTab: (tab: 'notes' | 'trash' | 'settings') => void;
  toggleSidebar: () => void;
  setIsCreatingNewNote: (isCreating: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      notes: [],
      trashedNotes: [],
      categories: [],
      tags: [],
      activeNote: null,
      activeNoteHistory: [],
      isSidebarOpen: true,
      isCreatingNewNote: false,
      isDarkMode: false,
      theme: 'system',
      searchFilters: {
        query: '',
        tags: [],
        categories: [],
        favoritesOnly: false,
        pinnedOnly: false,
        sortBy: 'updatedAt',
        sortDirection: 'desc',
      },
      selectedCategory: null,
      selectedTag: null,
      viewMode: 'list',
      activeTab: 'notes',
      isMobileMenuOpen: false,
      initialized: false,
      
      initializeApp: () => {
        // Create sample notes for each category if no notes exist
        const { notes } = get();
        if (notes.length === 0) {
          const sampleNotes: Note[] = [
            {
              id: '1',
              title: 'Welcome to Notes App',
              content: `<h1>Welcome to your new Notes App!</h1><p>This is a modern note-taking application with rich text editing capabilities. Here are some things you can do:</p><ul><li>Create and organize notes by categories</li><li>Format your text with <strong>bold</strong>, <em>italic</em>, and more</li><li>Add tags and categories to organize your notes</li><li>Pin important notes to keep them at the top</li><li>Switch between light and dark mode</li><li>Search and filter your notes</li></ul><p>Get started by creating a new note or exploring the app features!</p>`,
              isPinned: true,
              isFavorite: false,
              tags: ['important'],
              category: 'personal',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: '2',
              title: 'Project Planning',
              content: `<h2>Q1 Project Goals</h2><ul><li>Complete user research phase</li><li>Design new dashboard interface</li><li>Implement authentication system</li><li>Launch beta version</li></ul><p>Meeting scheduled for next Monday to discuss timeline and resource allocation.</p>`,
              isPinned: false,
              isFavorite: true,
              tags: ['todo', 'important'],
              category: 'work',
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: '3',
              title: 'App Feature Ideas',
              content: `<h2>New Features to Consider</h2><ul><li><strong>Voice Notes:</strong> Record audio notes for quick capture</li><li><strong>Collaboration:</strong> Share notes with team members</li><li><strong>Templates:</strong> Pre-built note templates for common use cases</li><li><strong>Export Options:</strong> PDF, Markdown, and Word export</li></ul><blockquote><p>Focus on features that enhance productivity and user experience.</p></blockquote>`,
              isPinned: false,
              isFavorite: false,
              tags: ['idea'],
              category: 'ideas',
              createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              updatedAt: new Date(Date.now() - 172800000).toISOString(),
            },
            {
              id: '4',
              title: 'Daily Tasks',
              content: `<h2>Today's Tasks</h2><ul><li>Review pull requests</li><li>Update project documentation</li><li>Prepare presentation for client meeting</li><li>Test new features</li><li>Send weekly report</li></ul><p><em>Remember to take breaks and stay hydrated!</em></p>`,
              isPinned: false,
              isFavorite: false,
              tags: ['todo'],
              category: 'tasks',
              createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              updatedAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ];
          
          set({
            notes: sampleNotes,
            activeNote: sampleNotes[0],
            initialized: true,
          });
        } else {
          set({ initialized: true });
        }
      },
      
      setActiveNote: (note) => {
        set({ activeNote: note, isCreatingNewNote: false });
      },
      
      createNote: (noteData) => {
        const timestamp = new Date().toISOString();
        const newNote: Note = {
          id: uuidv4(),
          title: noteData.title || 'Untitled Note',
          content: noteData.content || '',
          isPinned: noteData.isPinned || false,
          isFavorite: noteData.isFavorite || false,
          tags: noteData.tags || [],
          category: noteData.category || 'personal',
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNote: newNote,
          isCreatingNewNote: false,
        }));
        
        return newNote;
      },
      
      updateNote: (id, updates) => {
        set((state) => {
          const updatedNotes = state.notes.map((note) => 
            note.id === id 
              ? { 
                  ...note, 
                  ...updates, 
                  updatedAt: new Date().toISOString() 
                } 
              : note
          );
          
          const updatedNote = updatedNotes.find((note) => note.id === id) || null;
          
          return {
            notes: updatedNotes,
            activeNote: state.activeNote?.id === id ? updatedNote : state.activeNote,
          };
        });
      },
      
      deleteNote: (id) => {
        set((state) => {
          const noteToDelete = state.notes.find((note) => note.id === id);
          if (!noteToDelete) return state;
          
          return {
            notes: state.notes.filter((note) => note.id !== id),
            trashedNotes: [...state.trashedNotes, noteToDelete],
            activeNote: state.activeNote?.id === id ? null : state.activeNote,
          };
        });
      },
      
      restoreNote: (id) => {
        set((state) => {
          const noteToRestore = state.trashedNotes.find((note) => note.id === id);
          if (!noteToRestore) return state;
          
          return {
            trashedNotes: state.trashedNotes.filter((note) => note.id !== id),
            notes: [noteToRestore, ...state.notes],
          };
        });
      },
      
      permanentlyDeleteNote: (id) => {
        set((state) => ({
          trashedNotes: state.trashedNotes.filter((note) => note.id !== id),
        }));
      },
      
      togglePinNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) => 
            note.id === id 
              ? { 
                  ...note, 
                  isPinned: !note.isPinned,
                  updatedAt: new Date().toISOString()
                } 
              : note
          ),
        }));
      },
      
      toggleFavoriteNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) => 
            note.id === id 
              ? { 
                  ...note, 
                  isFavorite: !note.isFavorite,
                  updatedAt: new Date().toISOString()
                } 
              : note
          ),
        }));
      },
      
      addCategory: (category) => {
        const newCategory: Category = {
          id: uuidv4(),
          name: category.name || 'New Category',
          icon: category.icon,
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      removeCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          notes: state.notes.map((note) => 
            note.category === id 
              ? { ...note, category: 'personal' } 
              : note
          ),
        }));
      },
      
      addTag: (tag) => {
        const newTag: Tag = {
          id: uuidv4(),
          name: tag.name || 'New Tag',
          color: tag.color || '#3B82F6',
        };
        
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
      },
      
      removeTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          notes: state.notes.map((note) => ({
            ...note,
            tags: note.tags.filter((tagId) => tagId !== id),
          })),
        }));
      },
      
      setSearchFilters: (filters) => {
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        }));
      },
      
      setSelectedCategory: (categoryId) => {
        set({ 
          selectedCategory: categoryId,
          selectedTag: null,
          activeTab: 'notes'
        });
      },

      setSelectedTag: (tagId) => {
        set({ 
          selectedTag: tagId,
          selectedCategory: null,
          activeTab: 'notes'
        });
      },
      
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },
      
      setActiveTab: (tab) => {
        set({ 
          activeTab: tab,
          selectedCategory: null,
          selectedTag: null,
        });
      },
      
      toggleSidebar: () => {
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        }));
      },
      
      setIsCreatingNewNote: (isCreating) => {
        set({ isCreatingNewNote: isCreating });
      },
      
      setTheme: (theme) => {
        set({ theme });
      },
      
      setIsMobileMenuOpen: (isOpen) => {
        set({ isMobileMenuOpen: isOpen });
      },
      
      toggleDarkMode: () => {
        set((state) => ({ 
          isDarkMode: !state.isDarkMode 
        }));
      },
    }),
    {
      name: 'notes-storage',
      version: 1
    }
  )
);
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
