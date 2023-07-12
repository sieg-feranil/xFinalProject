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
            setLoginStatus('succesfuly logged-in')
            sessionStorage.setItem('jwtToken', res.data.accessToken);
            sessionStorage.setItem('username', res.data.username);
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
        <form onSubmit={handleSubmit}>

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
            {loginStatus && <span>{loginStatus  }</span>}
            <div>
                <span>forgot your password?</span>
                <Link to='/passRecup'>click here</Link>
            </div>
            <button type="submit">Log-in</button>
        </form>
    );
};

export default LoginForm