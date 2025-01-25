import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserConversations } from '../services/chatService';

const SavedConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
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

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
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
                            <div 
                                className="card" 
                                onClick={() => toggleExpand(conv.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <span>Conversation from {new Date(conv.timestamp).toLocaleString()}</span>
                                    <span className="text-muted">
                                        {expandedId === conv.id ? 'Click to collapse' : 'Click to expand'}
                                    </span>
                                </div>
                                <div 
                                    className="card-body" 
                                    style={{ 
                                        maxHeight: expandedId === conv.id ? 'none' : '300px',
                                        overflowY: 'auto',
                                        transition: 'max-height 0.3s ease-in-out'
                                    }}
                                >
                                    {conv.messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}
                                        >
                                            <div 
                                                className={`p-3 rounded-3 ${
                                                    msg.role === 'user' 
                                                        ? 'bg-danger text-white' 
                                                        : 'bg-secondary text-white'
                                                }`}
                                                style={{ 
                                                    maxWidth: '80%',
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'pre-wrap'
                                                }}
                                            >
                                                {msg.content}
                                            </div>
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