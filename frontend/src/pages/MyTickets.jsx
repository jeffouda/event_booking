import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get('/my-tickets');
                setTickets(response.data);
            } catch (error) {
                console.error("Error fetching tickets", error);
            }
        };
        fetchTickets();
    }, []);

    return (
        <div className="glass-container">
            {/* Header */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1 style={{margin: 0, color: '#333'}}>🎟️ My Bookings</h1>
                <button 
                    onClick={() => navigate('/events')} 
                    style={styles.backButton}
                >
                    ← Back to Events
                </button>
            </div>

            {/* Ticket List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {tickets.length > 0 ? (
                    tickets.map(ticket => (
                        <div key={ticket.id} style={styles.ticketCard}>
                            
                            {/* LEFT SIDE: Event Details */}
                            <div style={{ flex: 2, paddingRight: '20px', borderRight: '2px dashed #ccc' }}>
                                <h2 style={{ marginTop: 0, marginBottom: '5px', color: '#222' }}>
                                    {ticket.ticket_type?.event?.title || "Unknown Event"}
                                </h2>
                                <p style={{ color: '#555', margin: '5px 0' }}>
                                    📅 {ticket.ticket_type?.event?.date ? new Date(ticket.ticket_type.event.date).toLocaleDateString() : "N/A"} 
                                    {' '} @ {ticket.ticket_type?.event?.venue || "N/A"}
                                </p>
                                <p style={{ color: '#888', fontSize: '12px', marginTop: '15px' }}>
                                    Order ID: #{ticket.id} • Purchased: {new Date(ticket.purchase_date).toLocaleDateString()}
                                </p>
                            </div>

                            {/* RIGHT SIDE: Ticket Info */}
                            <div style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ backgroundColor: '#f0f4f8', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                    <span style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>
                                        Ticket Type
                                    </span>
                                    <span style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#007BFF', margin: '5px 0' }}>
                                        {ticket.ticket_type?.category || 'General'}
                                    </span>
                                    <span style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                                        ${ticket.ticket_type?.price || '0'}
                                    </span>
                                </div>
                                <div style={styles.confirmedBadge}>
                                    ✓ Confirmed
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <div style={styles.emptyState}>
                        <h3>No tickets found.</h3>
                        <p>Go to the Events page to book your first ticket!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    glassContainer: {
        maxWidth: '800px', margin: '30px auto', padding: '40px',
        // --- GLASS STYLE ---
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        minHeight: '80vh'
    },
    backButton: {
        padding: '10px 15px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px'
    },
    ticketCard: { 
        display: 'flex', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        border: '1px solid rgba(0,0,0,0.05)', 
        borderRadius: '16px', 
        padding: '25px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        alignItems: 'stretch'
    },
    confirmedBadge: {
        marginTop: '10px', textAlign: 'center', color: '#155724', backgroundColor: '#d4edda', padding: '5px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
    },
    emptyState: { textAlign: 'center', padding: '40px', color: '#666', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '16px' }
};

export default MyTickets;