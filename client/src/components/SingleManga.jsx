import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import ReccomendedManga from './ReccomendedManga';

const SingleManga1 = ({ isLoggedIn }) => {
  const { mal_id } = useParams();
  const [singleMangaData, setSingleMangaData] = useState({});
  const [isFav, setIsFav] = useState(false)
  const username = sessionStorage.getItem('username');
  const accessToken = sessionStorage.getItem('jwtToken')

  
  async function fetchData() {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/manga/${encodeURIComponent(mal_id)}`);
      const data = response.data;
      setSingleMangaData(data);
      console.log(singleMangaData.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handlePutReq() {

    try {
      const res = await axios.put('http://localhost:3000/favourites', {
        headers: {
          id: mal_id,
          username: username,
          Authorization: `Bearer ${accessToken}`,
        }
      });
      console.log('Richiesta PUT eseguita con successo', res);
      setIsFav(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteReq() {
    try {
      const res = await axios.delete('http://localhost:3000/favourites', {
        headers: {
          id: mal_id,
          username: username,
          Authorization: `Bearer ${accessToken}`,
        }
      });
      console.log('Richiesta DELETE eseguita con successo', res);
      setIsFav(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function checkIfFav() {
    if (isLoggedIn) {
      const res = await axios.get(`http://localhost:3000/favourites`, {
        headers: {
          username: username,
          Authorization: `Bearer ${accessToken}`
        }
      })
      const favsArray = res.data.includes(mal_id)
      console.log(favsArray);
      favsArray ? (setIsFav(true)) : (setIsFav(false))
    }
  }

  useEffect(() => {
    fetchData();
    checkIfFav();
  }, [mal_id]);

  return (

    singleMangaData.data && (
      <div className="manga-page">
        <h2>{singleMangaData.data.title}</h2>
        <div className='manga-info'>
          {singleMangaData.data.images && singleMangaData.data.images.webp && (
            <img src={singleMangaData.data.images.webp.image_url} alt={singleMangaData.data.title} />
          )}
          <ul>
            <li><h3>Score : {singleMangaData.data.score}</h3></li>
            <li><h3>Rank : {singleMangaData.data.rank}</h3></li>
            {singleMangaData.data.authors && (
              <li>
                <h3>
                  Authors : {singleMangaData.data.authors.map((author) => (
                    <Link to={author.url} target="blank">"{author.name}" </Link>
                  ))}
                </h3>
              </li>
            )}
            {singleMangaData.data.genres && (
              <li><h3>Genres : {singleMangaData.data.genres.map((genre) => genre.name).join(', ')}</h3></li>
            )}
            {isLoggedIn && (
              <button onClick={isFav ? handleDeleteReq : handlePutReq}>
                <FontAwesomeIcon icon={faHeart} style={{ color: isFav ? 'red' : 'black' }} />
              </button>
            )}
          </ul>

        </div>
        <span>{singleMangaData.data.synopsis}</span>
        <h3>Manga Like {singleMangaData.data.title}</h3>
        <ReccomendedManga />
      </div>
    )

  );
};

export default SingleManga1