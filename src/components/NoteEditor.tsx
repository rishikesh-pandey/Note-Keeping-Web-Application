import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1, 
  Heading2,
  Save,
  Trash2,
  Quote,
  Code,
  Strikethrough,
  Undo,
  Redo,
} from 'lucide-react';
import { useStore } from '../store';
import toast from 'react-hot-toast';

interface NoteEditorProps {
  isNewNote?: boolean;
  onCancel?: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ isNewNote = false, onCancel }) => {
  const { activeNote, createNote, updateNote, deleteNote, categories, tags, setIsCreatingNewNote, toggleSidebar } = useStore();
  
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg shadow-md max-w-full h-auto',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note here...',
      }),
    ],
    content: '',
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none dark:prose-invert focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      // Only auto-save for existing notes
      if (!isNewNote) {
        // Clear previous auto-save timer
        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer);
        }
        
        // Set new auto-save timer (2 seconds delay)
        const timer = setTimeout(() => {
          handleAutoSave(editor.getHTML());
        }, 2000);
        
        setAutoSaveTimer(timer);
      }
    },
  });
  
  // Initialize state from note data or defaults for new note
  useEffect(() => {
    if (isNewNote) {
      setTitle('');
      setSelectedCategory(categories[0]?.id || '');
      setSelectedTags([]);
      if (editor) {
        editor.commands.setContent('');
      }
    } else if (activeNote) {
      setTitle(activeNote.title);
      setSelectedCategory(activeNote.category);
      setSelectedTags(activeNote.tags);
      if (editor) {
        editor.commands.setContent(activeNote.content);
      }
    }
  }, [isNewNote, activeNote, categories, editor]);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);
  
  const handleAutoSave = (content: string) => {
    setIsSaving(true);
    
    if (isNewNote) {
      // Don't auto-save for new notes
      setIsSaving(false);
      return;
    }
    
    if (activeNote) {
      updateNote(activeNote.id, {
        title,
        content,
        category: selectedCategory,
        tags: selectedTags,
      });
      
      toast.success('Note saved', {
        id: 'autosave',
        duration: 1000,
        position: 'bottom-right',
      });
    }
    
    setIsSaving(false);
  };
  
  const handleSave = () => {
    if (!editor) return;
    
    const content = editor.getHTML();
    
    if (isNewNote) {
      createNote({
        title: title || 'Untitled Note',
        content,
        category: selectedCategory,
        tags: selectedTags,
      });
      
      toast.success('Note created');
      
      if (onCancel) {
        onCancel();
      }
    } else if (activeNote) {
      updateNote(activeNote.id, {
        title,
        content,
        category: selectedCategory,
        tags: selectedTags,
      });
      
      toast.success('Note saved');
    }
  };
  
  const handleDelete = () => {
    if (activeNote && confirm('Are you sure you want to delete this note?')) {
      deleteNote(activeNote.id);
      toast.success('Note moved to trash');
    }
  };
  
  // Helper functions for editor commands
  const addLink = () => {
    const url = window.prompt('Enter link URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };
  
  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  };
  
  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            setIsCreatingNewNote(true);
            break;
          case 's':
            e.preventDefault();
            if (activeNote) {
              updateNote(activeNote.id, activeNote);
            }
            break;
          case 'b':
            e.preventDefault();
            toggleSidebar();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNote]);
  
  // Editor toolbar button helper
  const ToolbarButton = ({ 
    onClick, 
    isActive = false,
    children,
    title,
    disabled = false,
  }: { 
    onClick: () => void; 
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-md transition-colors ${
          disabled 
            ? 'text-gray-300 cursor-not-allowed dark:text-gray-600'
            : isActive 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        }`}
        title={title}
      >
        {children}
      </button>
    );
  };
  
  if (!editor) {
    return <div className="flex items-center justify-center h-full">Loading editor...</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-none bg-transparent p-0 text-2xl font-semibold focus:outline-none focus:ring-0 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-2">
          {/* Undo/Redo */}
          <ToolbarButton 
            onClick={() => editor.chain().focus().undo().run()} 
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().redo().run()} 
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo size={18} />
          </ToolbarButton>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
          
          {/* Text Formatting */}
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleStrike().run()} 
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleCode().run()} 
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code size={18} />
          </ToolbarButton>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
          
          {/* Headings */}
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </ToolbarButton>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
          
          {/* Lists */}
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </ToolbarButton>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
          
          {/* Quote */}
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote size={18} />
          </ToolbarButton>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
          
          {/* Link */}
          <ToolbarButton 
            onClick={editor.isActive('link') ? removeLink : addLink}
            isActive={editor.isActive('link')}
            title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
          >
            <LinkIcon size={18} />
          </ToolbarButton>
          
          {/* Image */}
          <ToolbarButton 
            onClick={addImage}
            title="Add Image"
          >
            <ImageIcon size={18} />
          </ToolbarButton>
          
          <div className="flex-1"></div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {!isNewNote && activeNote && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            )}
            
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 transition-colors"
            >
              <Save size={16} className="mr-1" />
              {isNewNote ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
        
        <div className="border-t border-gray-200 p-4 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="min-w-0 flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTags((prev) =>
                        prev.includes(tag.id)
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id]
                      );
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                    style={{
                      backgroundColor: selectedTags.includes(tag.id) 
                        ? `${tag.color}20` 
                        : undefined,
                      color: selectedTags.includes(tag.id) 
                        ? tag.color 
                        : undefined,
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {isSaving && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-2"></span>
              Saving...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;