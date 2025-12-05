import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. Validation Schema (The "Rules")
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    // 2. Handle Submission
    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        const result = await login(values.email, values.password);
        
        if (!result.success) {
            setStatus(result.message); // Show error message from backend
        }
        setSubmitting(false);
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, status }) => (
                    <Form style={styles.form}>
                        {/* Global Error Message (e.g. "Invalid credentials") */}
                        {status && <div style={styles.errorBox}>{status}</div>}

                        <div style={styles.fieldGroup}>
                            <label>Email</label>
                            <Field type="email" name="email" style={styles.input} />
                            <ErrorMessage name="email" component="div" style={styles.errorText} />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label>Password</label>
                            <Field type="password" name="password" style={styles.input} />
                            <ErrorMessage name="password" component="div" style={styles.errorText} />
                        </div>

                        <button type="submit" disabled={isSubmitting} style={styles.button}>
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>

                        <p style={{marginTop: '10px'}}>
                            Don't have an account? <Link to="/register">Register here</Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

// Simple Styles (You can move this to CSS later)
const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
    input: { padding: '8px', fontSize: '16px', marginTop: '5px' },
    button: { padding: '10px', fontSize: '16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' },
    errorText: { color: 'red', fontSize: '12px', marginTop: '5px' },
    errorBox: { backgroundColor: '#ffe6e6', color: 'red', padding: '10px', borderRadius: '4px' }
};

export default Login;