// Page component for user login
import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        const result = await login(values.email, values.password);
        if (!result.success) {
            setStatus(result.message);
        }
        setSubmitting(false);
    };

    return (
        <div style={styles.container}>
            <h2 style={{textAlign: 'center', marginBottom: '30px', color: '#333'}}>Welcome Back</h2>
            
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, status }) => (
                    <Form style={styles.form}>
                        {status && <div style={styles.errorBox}>{status}</div>}

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Email Address</label>
                            <Field type="email" name="email" style={styles.input} placeholder="Enter your email" />
                            <ErrorMessage name="email" component="div" style={styles.errorText} />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Password</label>
                            <Field type="password" name="password" style={styles.input} placeholder="Enter your password" />
                            <ErrorMessage name="password" component="div" style={styles.errorText} />
                        </div>

                        <button type="submit" disabled={isSubmitting} style={styles.button}>
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>

                        <p style={{marginTop: '20px', textAlign: 'center', color: '#444'}}>
                            Don't have an account? <Link to="/register" style={{color: '#007BFF', fontWeight: 'bold'}}>Register here</Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

//GLASSMORPHISM STYLES 
const styles = {
    container: { 
        maxWidth: '400px', 
        margin: '15vh auto', // Centers it vertically
        padding: '40px', 
        
        //GLASS EFFECT 
        backgroundColor: 'rgba(255, 255, 255, 0.75)', 
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)', 
        
        borderRadius: '20px', 
        border: '1px solid rgba(255, 255, 255, 0.6)', 
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)', 
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
    label: { fontWeight: 'bold', marginBottom: '8px', color: '#333' },
    input: { 
        padding: '12px', 
        fontSize: '16px', 
        borderRadius: '8px', 
        border: '1px solid #ccc',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        outline: 'none'
    },
    button: { 
        padding: '14px', 
        fontSize: '16px', 
        backgroundColor: '#007BFF', 
        color: '#fff', 
        border: 'none', 
        cursor: 'pointer', 
        borderRadius: '8px', 
        fontWeight: 'bold',
        marginTop: '10px',
        boxShadow: '0 4px 6px rgba(0, 123, 255, 0.3)'
    },
    errorText: { color: '#d93025', fontSize: '13px', marginTop: '5px', fontWeight: '500' },
    errorBox: { backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#d93025', padding: '10px', borderRadius: '6px', textAlign: 'center' }
};

export default Login;