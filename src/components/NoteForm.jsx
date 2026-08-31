import { useEffect, useState } from "react";
function NoteForm({ onAdd, onUpdate, editNote }) {
    const [title,setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("")
    const [color,setColor]=useState("yellow");
    useEffect(()=>{
        if (editNote) {
            setTitle(editNote.title);
            setContent(editNote.content);
            setColor(editNote.color || "yellow")
        }else{
            setTitle("");
            setContent("");
            setColor("yellow");
        }
    },[editNote]);
    const handleSubmit = () =>{
       if(!content.trim()){
        setError("Content is required");
        return;
       }

       if(editNote){
        onUpdate({
            title: title.trim(),
            content: content.trim(),
            color: color
        });
       }else {
        onAdd({
            title: title.trim(),
            content: content.trim(),
            color: color
        });
       }
    };
    
    return (
        <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">
                {editNote ? "Edit Note" : "Create New Note"}
            </h2>

            <input type="text"
            placeholder="Title"
            value={title}
            className="w-full border rounded-lg px-4 py-3 mb-4 outline-none"
            onChange={(e)=> setTitle(e.target.value)} />

            <textarea placeholder="Content"
            value={content}
            className="w-full border rounded-lg px-4 py-3 h-40 resize-none outline-none"
            onChange={(e)=>{ setContent(e.target.value);
                setError("")
            }}/>
            <div className="flex gap-3 mt-4">
                <button
                onClick={() => setColor("yellow")}
                className="w-8 h-8 rounded-full bg-yellow-200 border"/>
                <button onClick={() => setColor("blue")}
                    className="w-8 h-8 rounded-full bg-blue-200 border"/>
                <button onClick={() => setColor("green")}
                    className="w-8 h-8 rounded-full bg-green-200 border"/>    
                <button onClick={() => setColor("pink")}
                    className="w-8 h-8 rounded-full bg-pink-200 border"/>    
                <button onClick={() => setColor("purple")}
                    className="w-8 h-8 rounded-full bg-purple-200 border"/>   
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )
            }
            <div className="flex justify-end mt-5">
                <button 
                onClick={handleSubmit}
                className="bg-black text-white px-5 py-2 rounded-lg">
                    {editNote ? "Update Note": "Create Note"}</button>
            </div>
        </div>
    )
}

export default NoteForm;