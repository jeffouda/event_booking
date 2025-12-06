import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

// Page component for displaying event details and ticket booking
const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const isAdmin = user?.is_admin === true;

    const fetchEventData = async () => {
        try {
            const response = await api.get('/events');
            const foundEvent = response.data.find(e => e.id === parseInt(id));
            if (foundEvent) {
                setEvent(foundEvent);
                setTicketTypes(foundEvent.ticket_types || []);
            }
        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventData();
    }, [id]);

    const handleBook = async (ticketTypeId) => {
        try {
            await api.post('/book', { ticket_type_id: ticketTypeId });
            alert("Booking Successful! Redirecting to your tickets...");
            navigate('/my-tickets');
        } catch (error) {
            alert("Booking failed. Please try again.");
        }
    };

    const handleDeleteEvent = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await api.delete(`/events/${id}`);
                alert("Event deleted successfully.");
                navigate('/events');
            } catch (error) {
                alert("Failed to delete event.");
            }
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px', color: 'white'}}>Loading...</div>;
    if (!event) return <div style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>Event not found</div>;

    // Check if the event has ended
    const currentTime = new Date();
    const endTime = new Date(event.end_time);
    const isEventPassed = currentTime > endTime;

    return (
        <div className="glass-container">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button onClick={() => navigate('/events')} style={styles.backButton}>← Back to Events</button>
                {isAdmin && <button onClick={handleDeleteEvent} style={styles.deleteButton}>🗑️ Delete Event</button>}
            </div>
            
            <div style={styles.header}>
                <h1 style={styles.title}>{event.title}</h1>
                <div style={styles.metaData}>
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>⏰ {formatTime(event.date)} - {formatTime(event.end_time)}</span>
                    <span>📍 {event.venue}</span>
                    {isEventPassed && <span style={styles.expiredBadge}>EVENT ENDED</span>}
                </div>
                <p style={styles.description}>{event.description}</p>
            </div>

            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)' }} />

            <h2 style={{color: '#333'}}>Available Tickets</h2>
            <div style={styles.ticketGrid}>
                {ticketTypes.length > 0 ? (
                    ticketTypes.map(ticket => (
                        <div key={ticket.id} style={styles.ticketCard}>
                            <h3 style={styles.ticketTitle}>{ticket.category}</h3>
                            <div style={styles.priceTag}>${ticket.price}</div>
                            <p style={styles.availability}>{ticket.quantity_available > 0 ? `${ticket.quantity_available} tickets left` : "SOLD OUT"}</p>
                            
                            <button 
                                onClick={() => handleBook(ticket.id)}
                                disabled={isEventPassed || ticket.quantity_available === 0}
                                style={(isEventPassed || ticket.quantity_available === 0) ? styles.disabledButton : styles.bookButton}
                            >
                                {isEventPassed ? "Event Ended" : ticket.quantity_available === 0 ? "Sold Out" : "Book Now"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{color: '#666'}}>No tickets have been released for this event yet.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    glassContainer: {
        maxWidth: '800px', margin: '30px auto', padding: '40px',
        
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        minHeight: '80vh'
    },
    backButton: { background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', fontSize: '16px', marginBottom: '20px', fontWeight: 'bold' },
    deleteButton: { backgroundColor: '#ffe6e6', color: '#dc3545', border: '1px solid #dc3545', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' },
    header: { textAlign: 'left' },
    title: { fontSize: '32px', color: '#222', margin: '0 0 10px 0' },
    metaData: { fontSize: '16px', color: '#555', display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' },
    expiredBadge: { backgroundColor: '#6c757d', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
    description: { fontSize: '18px', lineHeight: '1.6', color: '#333' },
    ticketGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' },
    ticketCard: { 
        border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '20px', 
        textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.8)', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    },
    ticketTitle: { margin: '0 0 10px 0', color: '#007BFF', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' },
    priceTag: { fontSize: '28px', fontWeight: 'bold', color: '#28a745', marginBottom: '5px' },
    availability: { color: '#666', fontSize: '13px', marginBottom: '15px' },
    bookButton: { width: '100%', padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    disabledButton: { width: '100%', padding: '12px', backgroundColor: '#e9ecef', color: '#6c757d', border: '1px solid #ced4da', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 'bold' }
};

export default EventDetails;