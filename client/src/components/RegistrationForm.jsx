import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
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
            }, 2000);


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
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
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
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div>
                <span>Already have an account?</span>
                <Link to="/login">Log in here</Link>
            </div>

            <button type="submit">Registrati</button>

            {success && <h3>La registrazione è andata a buon fine</h3>}
            {error && <span>{error}</span>}
        </form>
    );
};

export default RegistrationForm