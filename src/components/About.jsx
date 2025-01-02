import React from 'react';

const About = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4 display-4">About The Mad Gadfly</h1>
            
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <p className="lead text-center mb-4">
                        Welcome to The Mad Gadfly - where ancient wisdom meets modern AI.
                    </p>
                    
                    <p className="fs-5 mb-3">
                        Our platform combines the Socratic method with cutting-edge AI technology 
                        to create meaningful philosophical discussions. Just like Socrates, 
                        our AI companion challenges assumptions, asks probing questions, and 
                        helps users explore complex ideas.
                    </p>

                    <p className="fs-5 mb-3">
                        Whether you're a philosophy enthusiast or just starting your 
                        journey of intellectual discovery, The Mad Gadfly provides a 
                        unique space for reflection and dialogue.
                    </p>

                    <div className="mt-5">
                        <h2 className="h3 mb-3">Key Features:</h2>
                        <ul className="fs-5">
                            <li>Engage in Socratic dialogue with AI</li>
                            <li>Save and review your philosophical conversations</li>
                            <li>Take notes during your discussions</li>
                            <li>Explore various philosophical concepts</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 