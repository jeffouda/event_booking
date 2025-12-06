// Page component for user registration
import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        const result = await register(values.username, values.email, values.password);
        if (result.success) {
            alert("Registration successful! Please login.");
            navigate('/login');
        } else {
            setStatus(result.message);
        }
        setSubmitting(false);
    };

    return (
        <div style={styles.container}>
            <h2 style={{textAlign: 'center', marginBottom: '20px', color: '#333'}}>Create Account</h2>
            <Formik
                initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, status }) => (
                    <Form style={styles.form}>
                        {status && <div style={styles.errorBox}>{status}</div>}

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Username</label>
                            <Field type="text" name="username" style={styles.input} />
                            <ErrorMessage name="username" component="div" style={styles.errorText} />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Email</label>
                            <Field type="email" name="email" style={styles.input} />
                            <ErrorMessage name="email" component="div" style={styles.errorText} />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Password</label>
                            <Field type="password" name="password" style={styles.input} />
                            <ErrorMessage name="password" component="div" style={styles.errorText} />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <Field type="password" name="confirmPassword" style={styles.input} />
                            <ErrorMessage name="confirmPassword" component="div" style={styles.errorText} />
                        </div>

                        <button type="submit" disabled={isSubmitting} style={styles.button}>
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>

                        <p style={{marginTop: '20px', textAlign: 'center', color: '#444'}}>
                            Already have an account? <Link to="/login" style={{color: '#28a745', fontWeight: 'bold'}}>Login here</Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

// GLASSMORPHISM STYLES 
const styles = {
    container: {
        maxWidth: '400px',
        margin: '5vh auto', 
        padding: '40px',

        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',

        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
    label: { fontWeight: 'bold', marginBottom: '5px', color: '#333' },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        outline: 'none'
    },
    button: {
        padding: '12px',
        fontSize: '16px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '8px',
        fontWeight: 'bold',
        marginTop: '10px',
        boxShadow: '0 4px 6px rgba(40, 167, 69, 0.3)'
    },
    errorText: { color: '#d93025', fontSize: '13px', marginTop: '2px', fontWeight: '500' },
    errorBox: { backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#d93025', padding: '10px', borderRadius: '6px', textAlign: 'center' }
};

export default Register;