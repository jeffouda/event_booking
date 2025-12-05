import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. Fetch events from Backend when page loads
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events", error);
            }
        };
        fetchEvents();
    }, []);

    // 2. Handle Logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* --- HEADER SECTION --- */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '30px', 
                borderBottom: '1px solid #eee', 
                paddingBottom: '15px' 
            }}>
                <h1>Upcoming Events</h1>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                        {user ? `Hello, ${user.email}` : 'Welcome!'}
                    </span>
                    
                    {/* BUTTON: Go to My Tickets */}
                    <button 
                        onClick={() => navigate('/my-tickets')} 
                        style={{ 
                            padding: '8px 16px', 
                            cursor: 'pointer', 
                            backgroundColor: '#6c757d', // Grey
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px' 
                        }}
                    >
                        My Tickets
                    </button>

                    {/* BUTTON: Create New Event */}
                    <button 
                        onClick={() => navigate('/create-event')} 
                        style={{ 
                            padding: '8px 16px', 
                            cursor: 'pointer', 
                            backgroundColor: '#28a745', // Green
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        + Create Event
                    </button>

                    {/* BUTTON: Logout */}
                    <button 
                        onClick={handleLogout} 
                        style={{ 
                            padding: '8px 16px', 
                            cursor: 'pointer', 
                            backgroundColor: '#dc3545', // Red
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px' 
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
            
            {/* --- EVENT LIST GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {events.length > 0 ? (
                    events.map(event => (
                        <div key={event.id} style={{ 
                            border: '1px solid #e0e0e0', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h3 style={{ marginTop: 0, color: '#333' }}>{event.title}</h3>
                            
                            <p style={{ color: '#555', fontSize: '14px', margin: '5px 0' }}>
                                <strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            
                            <p style={{ color: '#555', fontSize: '14px', margin: '5px 0' }}>
                                <strong>📍 Venue:</strong> {event.venue}
                            </p>
                            
                            <p style={{ marginTop: '15px', lineHeight: '1.5', flex: 1 }}>
                                {event.description}
                            </p>

                            {/* BUTTON: View Details & Book */}
                            <button 
                                onClick={() => navigate(`/events/${event.id}`)}
                                style={{
                                    marginTop: '15px',
                                    padding: '12px',
                                    backgroundColor: '#007BFF', // Blue
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                View Details & Book →
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#777', fontSize: '18px' }}>
                        No events found. Click "Create Event" to add one!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Events;