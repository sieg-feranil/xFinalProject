import React, { useState } from 'react';

import axios from 'axios';

const DeleteAccount = ({setIsLoggedIn}) => {
    const [deleted, setDeleted]= useState(false)
    const username = sessionStorage.getItem('username');
  const accessToken = sessionStorage.getItem('jwtToken')
    const handleDeleteUser = async () => {
        try {

            const response = await axios.delete('http://localhost:3000/delete', {
                headers: {
                    username: username,
                    Authorization: `Bearer ${accessToken}`
                }
            });

            console.log(response.data); // Elabora la risposta come desiderato
            sessionStorage.removeItem('jwtToken');
            sessionStorage.removeItem('username');
            setIsLoggedIn(false)
            setDeleted(true)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {deleted?(
            <>
                <h3>You have succesfuly deleted your account</h3>
                <span>Your favourites manga list has been deleted</span>
                <img></img>
            </>
            ):(
            <>
            <h3>Delete Your Account</h3>
            <span>By clicking this button, you will delete your account</span>
            <button onClick={handleDeleteUser}>Delete Account</button>
            </>
            )}
            
        </div>
    );
};

export default DeleteAccount;
