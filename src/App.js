import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PhilosophicalChat from './components/PhilosophicalChat';
import SavedConversations from './components/SavedConversations';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './index.css';
import './App.css';

const Home = () => (
    <div className="container mt-4 bg-dark">
        <div className="row">
            <div className="col-md-12">
                <PhilosophicalChat />
            </div>
        </div>
    </div>
);

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="min-vh-100">
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
                            <Route path="/about" element={<About />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;


