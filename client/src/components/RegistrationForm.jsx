import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RegistrationForm.css'

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/;
        if (!passwordRegex.test(password)) {
            setError('La password deve avere almeno 4 caratteri, una lettera maiuscola, un numero e un carattere speciale');
            return;
        }

        try {
            await axios.post('http://localhost:3000/registration', {
                [username]: {
                    email: email,
                    password: password
                }
            });
            setUsername('');
            setEmail('');
            setPassword('');
            setError('');
            setSuccess(true);
            

            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);


        } catch (error) {
            if (error.response.status === 400) {
                let typeErr = error.response.data.split(' ')[0];
                if (typeErr === 'Email') {
                    setError('Email inserita è già in uso');
                } else if (typeErr === 'Username') {
                    setError('Username inserito è già in uso');
                }
            }
            setSuccess(false);
        }
    };

    return (
        <div className='registerForm'>
            <h2>Registration</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    placeholder='Insert your username...'
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    placeholder='Insert your email...'
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    placeholder='Insert your password...'
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <span className='errorStatus'>{error}</span>}
            <div>
                <span>Already have an account?</span>
                <Link to="/login">Log in here</Link>
            </div>

            <button type="submit">Register</button>

            {success && <h3>Registration sucessful</h3>}
            
        </form>
        </div>
    );
};

export default RegistrationForm