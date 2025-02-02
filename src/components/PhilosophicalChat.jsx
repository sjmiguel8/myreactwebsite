import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveConversation, sendMessage } from '../services/chatService';
import TodoList from './TodoList';

const PhilosophicalChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const systemMessage = {
                role: 'system',
                content: `You are a philosophical debater combining Socratic questioning with strong counter-arguments. For each response:
                    1. First, identify potential logical fallacies or weak points in the user's argument
                    2. Ask 1-2 probing questions to expose these weaknesses
                    3. Based on the conversation history and your questioning, present clear counter-arguments that:
                       - Challenge their premises
                       - Provide specific examples that contradict their position
                       - Offer alternative viewpoints with supporting logic
                    4. Maintain a respectful but assertive tone,
                    5. Keep total response under 8 sentences,
                    6. Never break character or format`
            };

            const aiMessage = await sendMessage([systemMessage, ...messages, userMessage]);
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const startNewConversation = () => {
        setMessages([]);
    };

    const handleSaveConversation = async () => {
        if (messages.length === 0) return;
        
        try {
            await saveConversation(user.uid, messages);
            alert('Conversation saved successfully!');
        } catch (error) {
            console.error('Error saving conversation:', error);
            alert('Failed to save conversation');
        }
    };

    return (
        <div className="container-fluid p-3">
            <div className="row">
                <div className="col-md-8">
                    <h2 className="text-center mb-4">Socrates</h2>
                    <div className="bg-light rounded p-3 mb-3" style={{height: "400px", overflowY: "auto"}}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}
                            >
                                <div 
                                    className={`p-3 rounded-3 ${
                                        message.role === 'user' 
                                            ? 'bg-danger text-white' 
                                            : 'bg-secondary text-white'
                                    }`}
                                    style={{ 
                                        maxWidth: '80%',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-center text-muted">
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-2">
                            <div className="col-12">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="form-control"
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="col-6">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="btn btn-danger w-100"
                                >
                                    Send
                                </button>
                            </div>
                            <div className="col-6">
                                <button 
                                    type="button"
                                    onClick={startNewConversation}
                                    className="btn btn-danger w-100"
                                >
                                    New
                                </button>
                            </div>
                        </div>
                    </form>
                    {messages.length > 0 && (
                        <button
                            onClick={handleSaveConversation}
                            className="btn btn-success w-100 mt-3"
                        >
                            Save Conversation
                        </button>
                    )}
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Notes</h4>
                        </div>
                        <div className="card-body">
                            <TodoList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhilosophicalChat;
