import React, { useState } from 'react';

const Form = (props) => {
    const [input, setInput] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        props.onSubmit({
            id: Math.floor(Math.random() * 10000),
            text: input
        });

        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                placeholder={props.placeholder || "Capture your philosophical insights..."}
                value={input}
                name="text"
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                onChange={e => setInput(e.target.value)}
            />
            <button 
                type="submit"
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
            >
                Add Note
            </button>
        </form>
    );
};

export default Form;