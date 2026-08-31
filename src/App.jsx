import { useState , useEffect } from "react";
import { Archive,ArchiveRestore, Pencil, Trash2} from "lucide-react"
import NoteForm from "./components/NoteForm";

function App() {
  const [search,setSearch]= useState("");
  const [activeTab, setActiveTab] = useState("notes")
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [notes, setNotes]=useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  useEffect(() => {
    localStorage.setItem("notes",JSON.stringify(notes));
  }, [notes]);
  const handleAddNote = (newNote) => {
    const noteWithId={
      ...newNote,
      id: Date.now(),
      Archived: false,
    };
    setNotes([...notes, noteWithId]);
    setSearch("");
    setShowForm(false);
  };
  const handleDeleteNote=(id) => {
    setNotes(notes.filter((note)=>note.id !== id))
  }
  const handleArchiveNote = (id)=>{
    setNotes(
      notes.map((note)=>
      note.id=== id
       ? {...note,Archived: !note.Archived}
      : note
    )
    );
  };
  const handleEditNote =(id) => {
    const note = notes.find((note) => note.id === id);
    if(!note){
      console.log("Note not found:",id);
      return;
    }
    setEditNote(note);
    setShowForm(true);
    
  };
  const colorClasses = {
     yellow: "bg-yellow-100",
  blue: "bg-blue-100",
  green: "bg-green-100",
  pink: "bg-pink-100",
  purple: "bg-purple-100",
  }
  const filteredNotes = notes.filter((note) =>{
    const matchesSearch =
         (note.title || "").toLowerCase().includes(search.toLowerCase()) ||
         (note.content || "").toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      activeTab === "notes"
        ? !note.Archived
        : note.Archived;

    return matchesSearch && matchesTab;    
})
  const handleUpdateNote = (updateNote) => {
    setNotes(
      notes.map((note) =>
      note.id ===editNote.id
    ? {...note, ...updateNote}
    : note
  )
    )
    setEditNote(null);
    setShowForm(false);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-2xl font-bold">
            📝 Keep Notes
          </h1>

          <input type="text"
          placeholder="Search notes..."
          value= {search}
          onChange={(e)=> setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2" />
          <button onClick={()=>{
            setEditNote(null);
            setShowForm(true);


          }}
            className="bg-black text-white px-5 py-2 rounded-lg">
              + New Note
            </button>
        </div>
      </header>

      <div className="flex gap-4 px-6 py-4 bg-white border-b">
        <button onClick={() => setActiveTab("notes")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "notes"
            ? "bg-black text-white"
            : "bg-gray-100"
          }`}>
            📝 Notes
          </button>

          <button
          onClick={() => setActiveTab("archived")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "archived"
            ? "bg-black text-white"
            : "bg-gray-100"
          }`}>
            📦 Archived
          </button>
      </div>
      {/* Note Form*/}
      {showForm && (
        <NoteForm onAdd={handleAddNote}
                  onUpdate={handleUpdateNote}
                  editNote={editNote}
                  onCancel={() =>{
                    setShowForm(false);
                    setEditNote(null)
                  }}/>
                  )}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note)=>(
          <div key={note.id}
          className={`${colorClasses[note.color] || "bg-yellow-100"} p-5 rounded-xl shadow overflow-hidden`}>
            <h2 className="text-xl font-bold">{note.title}</h2>
            <p className="mt-3 break-words whitespace-normal">{note.content}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
              onClick={()=>handleEditNote(note.id)}
              className="p-2 rounded-lg hover:bg-black/10"
              title="Edit note">
                <Pencil size={18}/>
              </button>
              <button 
              onClick={()=> handleArchiveNote(note.id)}
              className="p-2 rounded-lg hover:bg-black/10"
              title={note.Archived ? "Restore note" : "Archive note"}>
              {note.Archived ? (
                <ArchiveRestore size={18}/>
              ) : (
                <Archive size={18} />
              )}
              </button>
              <button onClick={() => handleDeleteNote(note.id)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-100"
                title="Delete note">
                  <Trash2 size={18}/>
              </button>
            </div>
          </div>
        )) }
        </div>
    </div>
  );
}
export default App