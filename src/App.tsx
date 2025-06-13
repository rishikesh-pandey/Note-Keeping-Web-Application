import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import NoteList from './components/NoteList';
import EmptyState from './components/EmptyState';
import Header from './components/Header';
import { useStore } from './store';
import { ThemeProvider } from './context/ThemeContext';
import MobileNavigation from './components/MobileNavigation';

function NotesApp() {
  const { 
    activeNote, 
    isSidebarOpen, 
    isCreatingNewNote, 
    setIsCreatingNewNote,
    selectedCategory,
    viewMode,
    initialized,
    initializeApp
  } = useStore();

  useEffect(() => {
    if (!initialized) {
      initializeApp();
    }
  }, [initialized, initializeApp]);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Toaster position="bottom-right" />
      
      {/* Sidebar - hidden on mobile */}
      <div className={`hidden md:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0'
      }`}>
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header />
        
        <main className="flex flex-1 overflow-hidden">
          {/* Note List - Hidden when creating a new note */}
          {!isCreatingNewNote && (
            <div className={`${activeNote ? 'hidden md:block' : 'block'} md:w-1/3 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800`}>
              <NoteList viewMode={viewMode} />
            </div>
          )}
          
          {/* Editor or Empty State */}
          <div className={`${activeNote || isCreatingNewNote ? 'block' : 'hidden md:block'} flex-1 h-full overflow-y-auto`}>
            {isCreatingNewNote ? (
              <NoteEditor 
                key="new-note"
                isNewNote={true}
                onCancel={() => setIsCreatingNewNote(false)}
              />
            ) : activeNote ? (
              <NoteEditor 
                key={activeNote.id}
                isNewNote={false}
              />
            ) : (
              <EmptyState 
                title={selectedCategory ? `No notes in ${selectedCategory}` : "No note selected"} 
                description="Select a note from the list or create a new one"
              />
            )}
          </div>
        </main>
        
        {/* Mobile Navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}

function App() {
  useKeyboardShortcuts(); // Add this line to enable keyboard shortcuts

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NotesApp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;