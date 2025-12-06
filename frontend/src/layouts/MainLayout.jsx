import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
    return (
        // The glass-container class comes from your index.css
        <div className="glass-container">
            {/* The Navbar sits at the top of every page */}
            <Navbar />
            
            {/* "children" represents the specific page content (Events, Create, etc.) */}
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;