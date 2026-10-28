import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  tags: string[];
  archived: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  createNote: (note: Omit<Note, "id">) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  searchNotes: (query: string) => Note[];
}

export const NotesContext = createContext<NotesContextType | undefined>(
  undefined
);

const API_URL = "http://localhost:3001/notes";

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes from JSON Server
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Note[]>(API_URL);
      setNotes(response.data);
    } catch {
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes when the app starts
  useEffect(() => {
    void fetchNotes();
  }, []);

  // Create a new note
  const createNote = async (note: Omit<Note, "id">) => {
    try {
      setError(null);
      const response = await axios.post<Note>(API_URL, note);
      setNotes((previous) => [...previous, response.data]);
    } catch {
      setError("Failed to create note.");
      throw new Error("Failed to create note.");
    }
  };

  // Update an existing note
  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      setError(null);

      const response = await axios.patch<Note>(
        `${API_URL}/${id}`,
        {
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      );

      setNotes((previous) =>
        previous.map((note) => (note.id === id ? response.data : note))
      );
    } catch {
      setError("Failed to update note.");
      throw new Error("Failed to update note.");
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/${id}`);

      setNotes((previous) => previous.filter((note) => note.id !== id));
    } catch {
      setError("Failed to delete note.");
      throw new Error("Failed to delete note.");
    }
  };

  // Archive / Unarchive a note
  const toggleArchive = async (id: string) => {
    const note = notes.find((item) => item.id === id);

    if (!note) return;

    await updateNote(id, { archived: !note.archived });
  };

  // Search notes
  const searchNotes = (query: string) => {
    const value = query.trim().toLowerCase();

    if (!value) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(value) ||
        note.content.toLowerCase().includes(value) ||
        note.tags.some((tag) => tag.toLowerCase().includes(value))
    );
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        toggleArchive,
        searchNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

// Custom hook to access NotesContext
export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used inside NotesProvider");
  }

  return context;
}