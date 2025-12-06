import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null; // Don't show navbar if not logged in

    return (
        <nav style={styles.nav}>
            {/* Left Side: Brand Name */}
            <Link to="/events" style={styles.brand}>
                EventSphere 🌍
            </Link>

            {/* Right Side: User Actions */}
            <div style={styles.actions}>
                <span style={styles.userText}>
                    Hello, <strong>{user.username || user.email}</strong>
                </span>
                
                <button onClick={() => navigate('/my-tickets')} style={styles.linkButton}>
                    My Tickets
                </button>
                
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
    },
    brand: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        textDecoration: 'none'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap'
    },
    userText: {
        color: '#555',
        marginRight: '10px'
    },
    linkButton: {
        background: 'none',
        border: '1px solid #6c757d',
        color: '#6c757d',
        padding: '8px 12px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px'
    }
};

export default Navbar;