import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import './RandomManga.css'


const RandomManga = ({ isLoggedIn }) => {
    const [randomManga, setRandomManga] = useState({})
    const [refresh, setRefresh] = useState(true)
    const [loading, setLoading] = useState(true);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.jikan.moe/v4/random/manga`);
        const data = response.data;
        setRandomManga(data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 429) {

          setLoading(true);
          await delay(400);
          await fetchData();
  
        } else {
  
          console.log(error);
        }
      }
    }
  
  
    async function handlePutReq() {
      const username = sessionStorage.getItem('username')
      console.log(mal_id);
      const data = {
        'id': mal_id,
        'username': username
      };
  
      const res = await axios.put('http://localhost:3000/addFavourites', data)
      console.log('Richiesta PUT eseguita con successo', res);
      // Gestisci la risposta della richiesta se necessario
  
  
    }
  
  
    useEffect(() => {
      fetchData();
    }, [refresh]);

    if (loading) {
      return (
      <>
      <h2>loading random manga</h2>
         <div className='loaderContainer'>
        <img className='loader' src="/moon_soul_eater.png" alt="a" />
        <h3>loading..</h3>
      </div>
      </>
      )
    }
  
    return (
      randomManga.data && (
        <div className="manga-page">
          <h2>{randomManga.data.title}</h2>
          <div className='manga-info'>
            {randomManga.data.images && randomManga.data.images.webp && (
              <img src={randomManga.data.images.webp.image_url} alt={randomManga.data.title} />
            )}
            <ul>
              <li><h3>Score : {randomManga.data.score}</h3></li>
              <li><h3>Rank : {randomManga.data.rank}</h3></li>
              {randomManga.data.authors && (
                <li>
                  <h3>
                    Authors : {randomManga.data.authors.map((author) => (
                      <Link to={author.url} target="blank">"{author.name}" </Link>
                    ))}
                  </h3>
                </li>
              )}
              {randomManga.data.genres && (
                <li><h3>Genres : {randomManga.data.genres.map((genre) => genre.name).join(', ')}</h3></li>
              )}<li className='buttonsLi'>
              {isLoggedIn && (
                
                  <button onClick={handlePutReq}><FontAwesomeIcon icon={faHeart} /></button>
                
              )}
              
                <button onClick={() => setRefresh(!refresh)}>refresh</button>
              </li>
            </ul>
  
          </div>
          <span>{randomManga.data.synopsis}</span>
        </div>
      )
    )
  }

  export default RandomManga