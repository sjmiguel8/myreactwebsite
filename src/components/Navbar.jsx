import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">The Mad Gadfly</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/saved">Saved Chats</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/about">About</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex">
                        {user ? (
                            <>
                                <span className="navbar-text me-3">{user.email}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="btn btn-outline-light"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className="nav-link" to="/login">Login</Link>
                                <Link className="nav-link" to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
