import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import TodoList from './components/TodoList';
import PhilosophicalChat from './components/PhilosophicalChat';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import SavedConversations from './components/SavedConversations';
import ConversationView from './components/ConversationView';

const Home = () => (
    <div className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Philosophical Discourse</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Discussion Notes</h2>
                <TodoList />
            </div>
            <div className="bg-white rounded-lg shadow p-4">
                <PhilosophicalChat />
            </div>
        </div>
    </div>
);

const About = () => (
    <div className="container mx-auto px-4 mt-8">
        <h1 className="text-xl text-gray-800">
            Welcome to The Mad Gadfly - a platform for engaging in Socratic dialogue and philosophical debate. 
            Challenge your assumptions, explore new perspectives, and engage in meaningful discourse with our AI interlocutor.
        </h1>
    </div>
);

const Contact = () => (
    <div className="container mx-auto px-4 mt-8">
        <h1 className="text-2xl text-gray-800">Get in Touch</h1>
        <p className="mt-4">Have questions about philosophical discourse? Reach out to us.</p>
    </div>
);

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen">
                    <Navbar />
                    <main className="container py-4">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            } />
                            <Route path="/saved" element={
                                <PrivateRoute>
                                    <SavedConversations />
                                </PrivateRoute>
                            } />
                            <Route path="/conversation/:id" element={
                                <PrivateRoute>
                                    <ConversationView />
                                </PrivateRoute>
                            } />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;


