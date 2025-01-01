import React, { useState } from 'react';
import Form from './Form';

const DiscussionNotes = () => {
    const [notes, setNotes] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const addNote = (note) => {
        if (!note.text || /^\s*$/.test(note.text)) {
            return;
        }
        const newNotes = [note, ...notes];
        setNotes(newNotes);
    };

    const removeNote = (id) => {
        const removeArr = [...notes].filter(note => note.id !== id);
        setNotes(removeArr);
    };

    const completeNote = (id) => {
        let updatedNotes = notes.map(note => {
            if (note.id === id) {
                note.isComplete = !note.isComplete;
            }
            return note;
        });
        setNotes(updatedNotes);
    };

    const updateNote = (id, newText) => {
        if (!newText || /^\s*$/.test(newText)) {
            return;
        }
        setNotes(prev => prev.map(note => 
            note.id === id ? { ...note, text: newText } : note
        ));
        setEditingId(null);
    };

    return (
        <div>
            <Form onSubmit={addNote} placeholder="Add a discussion note..." />
            <div className="mt-4">
                {notes.map((note, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-3 mb-2 rounded ${
                            note.isComplete ? 'bg-gray-100' : 'bg-white'
                        } border`}
                    >
                        {editingId === note.id ? (
                            <input
                                type="text"
                                className="flex-1 p-1 border rounded"
                                defaultValue={note.text}
                                onBlur={(e) => updateNote(note.id, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        updateNote(note.id, e.target.value);
                                    }
                                    if (e.key === 'Escape') {
                                        setEditingId(null);
                                    }
                                }}
                                autoFocus
                            />
                        ) : (
                            <div className="flex flex-1 items-center">
                                <div
                                    className={`flex-1 ${note.isComplete ? 'line-through text-gray-500' : ''}`}
                                    onClick={() => completeNote(note.id)}
                                >
                                    {note.text}
                                </div>
                                <button
                                    onClick={() => setEditingId(note.id)}
                                    className="mx-2 text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => removeNote(note.id)}
                                    className="text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscussionNotes;