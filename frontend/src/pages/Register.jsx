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
            <h2>Register</h2>
            <Formik
                initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, status }) => (
                    <Form style={styles.form}>
                        {status && <div style={styles.errorBox}>{status}</div>}

                        <div style={styles.fieldGroup}>
                            <label>Username</label>
                            <Field type="text" name="username" style={styles.input} />
                            <ErrorMessage name="username" component="div" style={styles.errorText} />
                        </div>

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

                        <div style={styles.fieldGroup}>
                            <label>Confirm Password</label>
                            <Field type="password" name="confirmPassword" style={styles.input} />
                            <ErrorMessage name="confirmPassword" component="div" style={styles.errorText} />
                        </div>

                        <button type="submit" disabled={isSubmitting} style={styles.button}>
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                        
                        <p style={{marginTop: '10px'}}>
                            Already have an account? <Link to="/login">Login here</Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

// Reusing the same simple styles
const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
    input: { padding: '8px', fontSize: '16px', marginTop: '5px' },
    button: { padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' },
    errorText: { color: 'red', fontSize: '12px', marginTop: '5px' },
    errorBox: { backgroundColor: '#ffe6e6', color: 'red', padding: '10px', borderRadius: '4px' }
};

export default Register;