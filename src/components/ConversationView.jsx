import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getConversation } from '../services/chatService';

const ConversationView = () => {
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const data = await getConversation(id);
                setConversation(data);
            } catch (error) {
                console.error('Error fetching conversation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!conversation) return <div>Conversation not found</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Conversation from {new Date(conversation.timestamp).toLocaleString()}</h2>
            <div className="bg-light p-4 rounded">
                {conversation.messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`mb-3 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}
                    >
                        <span className={`d-inline-block p-2 rounded ${
                            msg.role === 'user' 
                                ? 'bg-danger text-white' 
                                : 'bg-secondary text-white'
                        }`}>
                            {msg.content}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationView; 