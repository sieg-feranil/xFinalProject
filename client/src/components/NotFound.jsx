import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'

const NotFound = () => {
    return (
        <div className='notFound'>
            <div>
                <div className='typeError'>
                <span>ERROR </span>
                <span>404</span>
                </div>
                <div className='message'>
                    <span>The page you're looking for doesn't exist.
                    Please go <Link to={'/'}>back</Link></span>
                </div>
            </div>
            <img src='/radar.png' />
        </div>
    )
}

export default NotFound