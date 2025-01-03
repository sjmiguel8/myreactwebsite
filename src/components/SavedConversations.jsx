import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserConversations } from '../services/chatService';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

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

    const handleDelete = async (conversationId) => {
        if (!window.confirm('Are you sure you want to delete this conversation?')) {
            return;
        }

        try {
            const conversationsRef = doc(db, 'conversations', conversationId);
            await deleteDoc(conversationsRef);
            setConversations(conversations.filter(conv => conv.id !== conversationId));
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Saved Conversations</h2>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : conversations.length === 0 ? (
                <div className="alert alert-info text-center">
                    No saved conversations yet.
                </div>
            ) : (
                <div className="row">
                    {conversations.map((conv) => (
                        <div key={conv.id} className="col-12 mb-4">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <span>Conversation from {new Date(conv.timestamp).toLocaleString()}</span>
                                    <div>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(conv.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {conv.messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                                        >
                                            <span className={`p-2 rounded-pill ${
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedConversations; 