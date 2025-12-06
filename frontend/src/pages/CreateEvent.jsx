import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout'; 

const CreateEvent = () => {
    const navigate = useNavigate();
    const [ticketTypes, setTicketTypes] = useState([]);
    const [tempTicket, setTempTicket] = useState({ category: '', price: '', quantity_available: '' });

    // Validation Rules
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        venue: Yup.string().required('Venue is required'),
        date: Yup.date().required('Start Date is required'),
        end_time: Yup.date()
            .required('End Date is required')
            .min(Yup.ref('date'), "End time must be after start time"),
        description: Yup.string().required('Description is required'),
    });

  
    const addTicketToList = (e) => {
        e.preventDefault(); 
        if (!tempTicket.category || !tempTicket.price || !tempTicket.quantity_available) {
            alert("Please fill in all ticket fields");
            return;
        }
        setTicketTypes([...ticketTypes, tempTicket]);
        setTempTicket({ category: '', price: '', quantity_available: '' }); 
    };

    // Helper: Remove Ticket
    const removeTicket = (index) => {
        const newList = ticketTypes.filter((_, i) => i !== index);
        setTicketTypes(newList);
    };

    // Submit Logic
    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            
            const formattedValues = {
                ...values,
                date: values.date,
                end_time: values.end_time
            };

            // Create Event
            const response = await api.post('/events', formattedValues);
            const newEventId = response.data.id;

            // Create Tickets (if any)
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
        <MainLayout>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                
                {/* Back Button */}
                <button onClick={() => navigate('/events')} style={styles.backButton}>
                    ← Back to Events
                </button>

                <h2 style={{color: '#333', textAlign: 'center', marginBottom: '20px', marginTop: 0}}>Create New Event</h2>
                
                <Formik
                    initialValues={{ title: '', venue: '', date: '', end_time: '', description: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, status }) => (
                        <Form style={styles.form}>
                            {status && <div style={styles.errorBox}>{status}</div>}

                            {/* Section 1: Event Details */}
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>1. Event Details</h3>
                                <div style={styles.fieldGroup}>
                                    <label>Event Title</label>
                                    <Field type="text" name="title" style={styles.input} />
                                    <ErrorMessage name="title" component="div" style={styles.errorText} />
                                </div>
                                <div style={styles.fieldGroup}>
                                    <label>Venue</label>
                                    <Field type="text" name="venue" style={styles.input} />
                                    <ErrorMessage name="venue" component="div" style={styles.errorText} />
                                </div>
                                
                                <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                                    <div style={{...styles.fieldGroup, flex: 1}}>
                                        <label>Start Time</label>
                                        <Field type="datetime-local" name="date" style={styles.input} />
                                        <ErrorMessage name="date" component="div" style={styles.errorText} />
                                    </div>
                                    <div style={{...styles.fieldGroup, flex: 1}}>
                                        <label>End Time</label>
                                        <Field type="datetime-local" name="end_time" style={styles.input} />
                                        <ErrorMessage name="end_time" component="div" style={styles.errorText} />
                                    </div>
                                </div>

                                <div style={styles.fieldGroup}>
                                    <label>Description</label>
                                    <Field as="textarea" name="description" style={{...styles.input, height: '80px'}} />
                                    <ErrorMessage name="description" component="div" style={styles.errorText} />
                                </div>
                            </div>

                            {/* Section 2: Tickets */}
                            <div style={styles.section}>
                                <h3 style={styles.sectionTitle}>2. Create Tickets</h3>
                                <div style={{display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap'}}>
                                    <input placeholder="Category (VIP)" value={tempTicket.category} onChange={e => setTempTicket({...tempTicket, category: e.target.value})} style={styles.smallInput} />
                                    <input placeholder="Price (Ksh.)" type="number" value={tempTicket.price} onChange={e => setTempTicket({...tempTicket, price: e.target.value})} style={styles.smallInput} />
                                    <input placeholder="Qty" type="number" value={tempTicket.quantity_available} onChange={e => setTempTicket({...tempTicket, quantity_available: e.target.value})} style={{...styles.smallInput, width: '60px'}} />
                                    <button type="button" onClick={addTicketToList} style={styles.addButton}>+ Add</button>
                                </div>
                                <div style={styles.ticketList}>
                                    {ticketTypes.length === 0 && <p style={{fontSize: '13px', color: '#777'}}>No tickets added yet.</p>}
                                    {ticketTypes.map((t, index) => (
                                        <div key={index} style={styles.ticketItem}>
                                            <span><strong>{t.category}</strong> - Ksh.{t.price} ({t.quantity_available} avail)</span>
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
        </MainLayout>
    );
};

const styles = {
    backButton: { background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', fontSize: '16px', marginBottom: '10px', fontWeight: 'bold' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '20px' },
    sectionTitle: { marginTop: 0, color: '#007BFF', fontSize: '18px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left', marginBottom: '10px' },
    input: { padding: '10px', fontSize: '16px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'rgba(255,255,255,0.8)' },
    smallInput: { padding: '8px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc', flex: 1, minWidth: '80px' },
    submitButton: { padding: '15px', fontSize: '18px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    addButton: { padding: '8px 15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    removeButton: { background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', marginLeft: '10px' },
    ticketList: { backgroundColor: 'rgba(240, 240, 240, 0.5)', padding: '10px', borderRadius: '8px' },
    ticketItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' },
    errorText: { color: 'red', fontSize: '12px', marginTop: '5px' },
    errorBox: { backgroundColor: '#ffe6e6', color: 'red', padding: '10px', borderRadius: '4px' }
};

export default CreateEvent;