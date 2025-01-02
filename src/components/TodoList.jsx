import React, { useState } from 'react';

const TodoList = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleAddNote = () => {
        if (newNote.trim()) {
            setNotes([...notes, {
                id: Date.now(),
                text: newNote,
            }]);
            setNewNote('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddNote();
        }
    };

    const handleDelete = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const startEdit = (note) => {
        setEditingId(note.id);
        setEditText(note.text);
    };

    const handleEdit = (id) => {
        if (editText.trim()) {
            setNotes(notes.map(note => 
                note.id === id ? { ...note, text: editText } : note
            ));
            setEditingId(null);
            setEditText('');
        }
    };

    return (
        <div>
            <div className="input-group mb-3">
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={handleKeyPress}
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
                {notes.map((note) => (
                    <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {editingId === note.id ? (
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="form-control"
                                />
                                <button 
                                    onClick={() => handleEdit(note.id)}
                                    className="btn btn-success"
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => setEditingId(null)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <span>{note.text}</span>
                                <div>
                                    <button 
                                        onClick={() => startEdit(note)}
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(note.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;