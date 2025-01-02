import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import { useAuth } from '../context/AuthContext';
import { saveConversation, getUserConversations } from '../services/chatService';

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
            const openai = new OpenAI({
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,
                dangerouslyAllowBrowser: true
            });

            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
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
                    },
                    ...messages,
                    userMessage
                ],
                max_tokens: 400,
                temperature: 0.7
            });

            const aiMessage = {
                role: 'assistant',
                content: response.choices[0].message.content
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please check the console for details and ensure your API key is properly configured.'
            }]);
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
            <h2 className="text-center mb-4">Socrates</h2>
            <div className="bg-light rounded p-3 mb-3" style={{height: "300px", overflowY: "auto"}}>
                {messages.map((message, index) => (
                    <div key={index} className={`d-flex ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                        <span className={`p-2 rounded-pill ${message.role === 'user' ? 'bg-danger text-white' : 'bg-secondary text-white'}`}>
                            {message.content}
                        </span>
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
    );
};

export default PhilosophicalChat;