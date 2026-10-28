import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Pencil,
  Trash2,
} from "lucide-react";

import NoteForm from "./components/NoteForm";
import { useNotes } from "./context/NotesContext";

function App() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("notes");
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);

  const {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    toggleArchive,
  } = useNotes();

  const colorClasses = {
    yellow: "bg-yellow-100",
    blue: "bg-blue-100",
    green: "bg-green-100",
    pink: "bg-pink-100",
    purple: "bg-purple-100",
  };

  // Add a new note
  const handleAddNote = async (newNote) => {
    try {
      await createNote({
        ...newNote,
        color: newNote.color || "yellow",
        tags: newNote.tags || [],
        archived: false,
        stock: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setSearch("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  // Archive or restore a note
  const handleArchiveNote = async (id) => {
    try {
      await toggleArchive(id);
    } catch (err) {
      console.error("Failed to archive note:", err);
    }
  };

  // Open a note for editing
  const handleEditNote = (id) => {
    const note = notes.find((item) => String(item.id) === String(id));

    if (!note) {
      console.error("Note not found:", id);
      return;
    }

    setEditNote(note);
    setShowForm(true);
  };

  // Update an existing note
  const handleUpdateNote = async (updatedNote) => {
    if (!editNote) return;

    try {
      await updateNote(editNote.id, updatedNote);

      setEditNote(null);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  // Search and filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (note.content || "").toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === "notes"
        ? !note.archived
        : note.archived;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            📝 Keep Notes
          </h1>

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <button
            onClick={() => {
              setEditNote(null);
              setShowForm(true);
            }}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            + New Note
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-4 px-6 py-4 bg-white border-b">
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "notes"
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          📝 Notes
        </button>

        <button
          onClick={() => setActiveTab("archived")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "archived"
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          📦 Archived
        </button>
      </div>

      {/* Note Form */}
      {showForm && (
        <NoteForm
          onAdd={handleAddNote}
          onUpdate={handleUpdateNote}
          editNote={editNote}
          onCancel={() => {
            setShowForm(false);
            setEditNote(null);
          }}
        />
      )}

      {/* Loading */}
      {loading && (
        <p className="p-6 text-gray-500">
          Loading notes...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="p-6 text-red-500">
          {error}
        </p>
      )}

      {/* Notes Grid */}
      {!loading && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`${
                colorClasses[note.color] || "bg-yellow-100"
              } p-5 rounded-xl shadow overflow-hidden`}
            >
              <h2 className="text-xl font-bold">
                {note.title}
              </h2>

              <p className="mt-3 break-words whitespace-normal">
                {note.content}
              </p>

              <div className="flex justify-end gap-2 mt-4">
                {/* Edit */}
                <button
                  onClick={() => handleEditNote(note.id)}
                  className="p-2 rounded-lg hover:bg-black/10"
                  title="Edit note"
                >
                  <Pencil size={18} />
                </button>

                {/* Archive / Restore */}
                <button
                  onClick={() => handleArchiveNote(note.id)}
                  className="p-2 rounded-lg hover:bg-black/10"
                  title={
                    note.archived
                      ? "Restore note"
                      : "Archive note"
                  }
                >
                  {note.archived ? (
                    <ArchiveRestore size={18} />
                  ) : (
                    <Archive size={18} />
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-100"
                  title="Delete note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-10">
              {search
                ? "No matching notes found."
                : activeTab === "archived"
                  ? "No archived notes yet."
                  : "No notes yet. Create your first note!"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;