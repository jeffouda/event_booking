import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Page component for displaying and searching events
const Events = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

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

    const formatTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1 style={{margin: 0, color: '#333'}}>Upcoming Events</h1>
                <button onClick={() => navigate('/create-event')} style={styles.createButton}>+ Create Event</button>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                <input 
                    type="text" 
                    placeholder="🔍 Search events or venues..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>
            
            {/* Grid */}
            <div className="event-grid">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div key={event.id} style={styles.card}>
                            <h3 style={{ marginTop: 0, color: '#007BFF' }}>{event.title}</h3>
                            <p style={styles.text}><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <p style={styles.text}><strong>⏰ Time:</strong> {formatTime(event.date)} - {formatTime(event.end_time)}</p>
                            <p style={styles.text}><strong>📍 Venue:</strong> {event.venue}</p>
                            <p style={{ ...styles.text, marginTop: '15px', flex: 1 }}>{event.description}</p>
                            <button onClick={() => navigate(`/events/${event.id}`)} style={styles.cardButton}>
                                View Details & Book →
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={styles.emptyState}>
                        <p>No events found.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

const styles = {
    createButton: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(0,0,0,0.05)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    text: { color: '#555', fontSize: '14px', margin: '5px 0' },
    cardButton: { marginTop: '15px', padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    emptyState: { textAlign: 'center', gridColumn: '1/-1', color: '#777', fontSize: '18px', padding: '40px' },
    searchInput: { padding: '12px 20px', fontSize: '16px', borderRadius: '30px', border: '1px solid #ccc', outline: 'none', width: '100%', maxWidth: '500px', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }
};

export default Events;