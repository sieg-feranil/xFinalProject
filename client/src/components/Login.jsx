import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'



const LoginForm = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('')

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();//check
        try {
            const res = await axios.post('http://localhost:3000/login', {
                "email": email,
                "password": password
            });
            setIsLoggedIn(true);
            sessionStorage.setItem('jwtToken', res.data.accessToken);
            sessionStorage.setItem('username', res.data.username);
            sessionStorage.setItem('timer', res.data.timer);
            navigate('/')
        } catch (error) {
            setLoginStatus(error.response.data); // Imposta il messaggio di errore
        }


        // Resetta i campi del form
        // setUsername('');
        // setEmail('');
        // setPassword('');



    };

    return (
        <div className='loginForm'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} >

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
                {loginStatus && <span className='errorStatus'>{loginStatus}</span>}
                <div>
                    <span>Forgot your password?</span>
                    <Link to='/passRecup'>Click here</Link>
                </div>
                <button type="submit">Log-in</button>
            </form>
            
        </div>
    );
};

export default LoginForm