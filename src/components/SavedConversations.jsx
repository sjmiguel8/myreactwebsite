import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserConversations } from '../services/chatService';

const SavedConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const userConversations = await getUserConversations(user.uid);
                setConversations(userConversations);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [user]);

    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Saved Conversations</h2>
            {loading ? (
                <p>Loading...</p>
            ) : conversations.length === 0 ? (
                <p>No saved conversations yet.</p>
            ) : (
                conversations.map((conv) => (
                    <div key={conv.id} className="bg-white p-4 rounded-lg shadow mb-4">
                        <p className="text-sm text-gray-500">
                            {new Date(conv.timestamp).toLocaleString()}
                        </p>
                        {conv.messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`mt-2 ${
                                    msg.role === 'user' ? 'text-right' : 'text-left'
                                }`}
                            >
                                <span className={`inline-block p-2 rounded-lg ${
                                    msg.role === 'user' 
                                        ? 'bg-red-700 text-white' 
                                        : 'bg-gray-200'
                                }`}>
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};

export default SavedConversations; 