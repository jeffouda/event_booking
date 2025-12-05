import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const { logout, user } = useContext(AuthContext);

    // Fetch events when page loads
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

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Upcoming Events</h1>
                <div>
                    <span>Welcome, {user?.email} </span>
                    <button onClick={logout} style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {events.map(event => (
                    <div key={event.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                        <h3>{event.title}</h3>
                        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                        <p><strong>Venue:</strong> {event.venue}</p>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;