import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const navigate = useNavigate();
    
    // We keep a separate list for tickets the user wants to add
    const [ticketTypes, setTicketTypes] = useState([]);
    
    // Temporary state for the "Add Ticket" inputs
    const [tempTicket, setTempTicket] = useState({ category: '', price: '', quantity_available: '' });

    // 1. Validation for the Event Details
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        venue: Yup.string().required('Venue is required'),
        date: Yup.date().required('Date is required').min(new Date(), "Date cannot be in the past"),
        description: Yup.string().required('Description is required'),
    });

    // 2. Helper to add a ticket to our temporary list
    const addTicketToList = (e) => {
        e.preventDefault(); // Stop form from submitting
        if (!tempTicket.category || !tempTicket.price || !tempTicket.quantity_available) {
            alert("Please fill in all ticket fields");
            return;
        }
        setTicketTypes([...ticketTypes, tempTicket]);
        setTempTicket({ category: '', price: '', quantity_available: '' }); // Reset inputs
    };

    // 3. Helper to remove a ticket from list
    const removeTicket = (index) => {
        const newList = ticketTypes.filter((_, i) => i !== index);
        setTicketTypes(newList);
    };

    // 4. THE MASTER SUBMIT
    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            // A. Create the Event first
            const formattedValues = {
                ...values,
                date: new Date(values.date).toISOString() 
            };
            const response = await api.post('/events', formattedValues);
            const newEventId = response.data.id;

            // B. If event created successfully, create all the ticket types
            // We use Promise.all to send them all at the same time
            if (ticketTypes.length > 0) {
                const ticketPromises = ticketTypes.map(ticket => {
                    return api.post(`/events/${newEventId}/tickets`, {
                        category: ticket.category,
                        price: parseFloat(ticket.price),
                        quantity_available: parseInt(ticket.quantity_available)
                    });
                });
                await Promise.all(ticketPromises);
            }

            alert("Event & Tickets Created Successfully!");
            navigate('/events');
        } catch (error) {
            console.error(error);
            setStatus("Failed to create event. Please try again.");
        }
        setSubmitting(false);
    };

    return (
        <div style={styles.container}>
            <h2 style={{color: '#333'}}>Create New Event</h2>
            
            <Formik
                initialValues={{ title: '', venue: '', date: '', description: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, status }) => (
                    <Form style={styles.form}>
                        {status && <div style={styles.errorBox}>{status}</div>}

                        {/* --- EVENT DETAILS SECTION --- */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>1. Event Details</h3>
                            
                            <div style={styles.fieldGroup}>
                                <label>Event Title</label>
                                <Field type="text" name="title" style={styles.input} placeholder="e.g. Tech Conference 2025" />
                                <ErrorMessage name="title" component="div" style={styles.errorText} />
                            </div>

                            <div style={styles.fieldGroup}>
                                <label>Venue</label>
                                <Field type="text" name="venue" style={styles.input} placeholder="e.g. Nairobi Hub" />
                                <ErrorMessage name="venue" component="div" style={styles.errorText} />
                            </div>

                            <div style={styles.fieldGroup}>
                                <label>Date & Time</label>
                                <Field type="datetime-local" name="date" style={styles.input} />
                                <ErrorMessage name="date" component="div" style={styles.errorText} />
                            </div>

                            <div style={styles.fieldGroup}>
                                <label>Description</label>
                                <Field as="textarea" name="description" style={{...styles.input, height: '80px'}} />
                                <ErrorMessage name="description" component="div" style={styles.errorText} />
                            </div>
                        </div>

                        {/* --- TICKET TYPES SECTION --- */}
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>2. Create Tickets</h3>
                            
                            {/* Inputs to add a ticket */}
                            <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                                <input 
                                    placeholder="Category (VIP)" 
                                    value={tempTicket.category}
                                    onChange={e => setTempTicket({...tempTicket, category: e.target.value})}
                                    style={styles.smallInput}
                                />
                                <input 
                                    placeholder="Price ($)" 
                                    type="number" 
                                    value={tempTicket.price}
                                    onChange={e => setTempTicket({...tempTicket, price: e.target.value})}
                                    style={styles.smallInput}
                                />
                                <input 
                                    placeholder="Qty" 
                                    type="number" 
                                    value={tempTicket.quantity_available}
                                    onChange={e => setTempTicket({...tempTicket, quantity_available: e.target.value})}
                                    style={{...styles.smallInput, width: '60px'}}
                                />
                                <button type="button" onClick={addTicketToList} style={styles.addButton}>+ Add</button>
                            </div>

                            {/* List of added tickets */}
                            <div style={{backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px'}}>
                                {ticketTypes.length === 0 && <p style={{fontSize: '13px', color: '#777'}}>No tickets added yet.</p>}
                                {ticketTypes.map((t, index) => (
                                    <div key={index} style={styles.ticketItem}>
                                        <span><strong>{t.category}</strong> - ${t.price} ({t.quantity_available} avail)</span>
                                        <button type="button" onClick={() => removeTicket(index)} style={styles.removeButton}>x</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
                            {isSubmitting ? 'Creating...' : '🚀 Launch Event'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

const styles = {
    container: { maxWidth: '600px', margin: '30px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { borderBottom: '1px solid #eee', paddingBottom: '20px' },
    sectionTitle: { marginTop: 0, color: '#007BFF', fontSize: '18px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left', marginBottom: '10px' },
    input: { padding: '10px', fontSize: '16px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' },
    smallInput: { padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 },
    submitButton: { padding: '15px', fontSize: '18px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '6px', fontWeight: 'bold' },
    addButton: { padding: '8px 15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    removeButton: { background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', marginLeft: '10px' },
    ticketItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' },
    errorText: { color: 'red', fontSize: '12px', marginTop: '5px' },
    errorBox: { backgroundColor: '#ffe6e6', color: 'red', padding: '10px', borderRadius: '4px' }
};

export default CreateEvent;