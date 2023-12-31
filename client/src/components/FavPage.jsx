import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FavPage.css'

const FavPage = ({ isLoggedIn }) => {
  const [fav, setFav] = useState([]);
  const [loading, setLoading] = useState(true);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/favourites', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
          username: `${sessionStorage.getItem('username')}`
        }
      });
      const favIds = response.data;

      const fetchMangaDetails = async () => {
        const uniqueFav = [];
        for (let i = 0; i < favIds.length; i++) {
          const mangaId = favIds[i];
          const mangaResponse = await axios.get(
            `https://api.jikan.moe/v4/manga/${mangaId}`
          );
          const mangaData = mangaResponse.data.data;

          // Verifica se il manga è già presente nello stato fav
          if (!uniqueFav.find((manga) => manga.mal_id === mangaData.mal_id)) {
            uniqueFav.push(mangaData);
            setFav([...uniqueFav]);
          }

          await new Promise(resolve => setTimeout(resolve, 400));
        }


      };

      fetchMangaDetails();
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 429) {

        await delay(400);
        await fetchData();

      } else {

        console.log(error);
      }
    }
  };



  return (
    <div className='mangaDisplay'>
      <h3>Favourites Manga</h3>
      {isLoggedIn ? (
        <div className="manga-list">
          {fav &&
            fav.map((manga, i) => (
              <div key={i} className="manga-card">
                <Link to={`/manga/${encodeURIComponent(manga.mal_id)}`}>
                  <img src={manga.images.webp.image_url} alt={manga.title} />
                  <h4>{manga.title}</h4>
                  <span>RANK:{manga.rank}</span>
                  <span>SCORE:{manga.score}</span>
                </Link>
              </div>
            ))}
          {loading && (
            <div className='loaderContainer'>
              <img className='loader' src="/moon_soul_eater.png" alt="a" />
              <h3>loading..</h3>
            </div>
          )}
        </div>
      ) : (
        <div className='PleaseLogin'>
          <img id="YuiStops" alt="Yui" src='/stop.png' />
          <h2>Please <Link to={'/login'}>login</Link> / <Link to={'/registration'}>register</Link> to access this feature</h2>
        </div>
      )}
    </div>
  );
};

export default FavPage;
