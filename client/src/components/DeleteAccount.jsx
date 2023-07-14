import React, { useState } from 'react';
import axios from 'axios';
import './DeleteAccount.css';

const DeleteAccount = ({ setIsLoggedIn }) => {
  const [deleted, setDeleted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const username = sessionStorage.getItem('username');
  const accessToken = sessionStorage.getItem('jwtToken');

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
      setIsLoggedIn(false);
      setDeleted(true);
      setTimeout(() => {
        window.location.href = '/login';
    }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    if (clicked) {
      handleDeleteUser();
    } else {
      setClicked(true);
    }
  };

  return (
    <div>
      {deleted ? (
        <div className="deleteContainer">
          <h3>You've successfully deleted your account</h3>
          <img className="deleteImg" src="/saitama.png" alt="ok" />
          <span>Your favorites manga list has been deleted</span>
        </div>
      ) : (
        <div className="deleteContainer">
          <h2>Delete Your Account</h2>
          {clicked?(<span>Are you really sure about deleting your account?!?!?!</span>
          ):(
          <span>By clicking this button, you will delete your account!</span>)}
          <button onClick={handleClick}>
            {clicked? 'Yeah i want to delete my account':'Delete Account'}
          </button>
          {clicked && <img className="deleteImg" src="/eww.png" alt="eww" />}
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
