import React from 'react';
import { Link } from 'react-router-dom';


const PassRecup = () => {
  return (
    <div className='deleteContainer'>
      <h2>So you lost your password?</h2>
      <span>I only higlighted <Link to={'https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran'}  target="_blank">'click here'</Link> i didn't mean i'd actually help you reset your password!</span>
      <img src="shrug.png" alt="shrug" />
      <span>The feature is under development but for now I didn't have enough time, sleep or will to deploy it on time....
        You can stay here and admire Tohru or go <Link to={'/'}>back to the home page</Link>. </span>
      
    </div>
  );
};

export default PassRecup;
