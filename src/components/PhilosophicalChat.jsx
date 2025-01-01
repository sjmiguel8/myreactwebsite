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
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Socrates</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-[300px] overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg text-sm ${message.role === 'user' ? 'bg-red-700 text-white' : 'bg-gray-200'}`}>
                            {message.content}
                        </span>
                    </div>
                ))}
                {isLoading && (
                    <div className="text-center text-gray-500">
                        Thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-700"
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors disabled:bg-gray-400"
                >
                    Send
                </button>
                <button
                    type="button"
                    onClick={startNewConversation}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                    New
                </button>
            </form>
            {messages.length > 0 && (
                <button
                    onClick={handleSaveConversation}
                    className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                    Save Conversation
                </button>
            )}
        </div>
    );
};

export default PhilosophicalChat;