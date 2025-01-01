import React, { useState } from 'react';

const TodoList = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (newNote.trim()) {
            setNotes([...notes, newNote]);
            setNewNote('');
        }
    };

    return (
        <div>
            <div className="input-group mb-3">
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="form-control"
                    placeholder="Add a new note..."
                />
                <button 
                    onClick={handleAddNote}
                    className="btn btn-danger"
                >
                    Add Note
                </button>
            </div>
            <ul className="list-group">
                {notes.map((note, index) => (
                    <li key={index} className="list-group-item">{note}</li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;