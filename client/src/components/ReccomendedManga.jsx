import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './ReccomendedManga.css'

function ReccomendedManga() {
  const [reccomended, setReccomended] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { mal_id } = useParams();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/manga/${encodeURIComponent(mal_id)}/recommendations`);
      const data = response.data;
      setReccomended(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    setCurrentIndex(0)
  }, [mal_id]);

  const handleNext = () => {
    setCurrentIndex(prevIndex => prevIndex + 4);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => prevIndex - 4);
  };

  if (loading) {
    return (
    <>
       <div className='loaderContainer'>
      <img className='loader' src="/moon_soul_eater.png" alt="a" />
      <h3>loading..</h3>
    </div>
    </>
    )
  }

  return (
    <div className='mangaDisplay'>
      <div className="manga-list">
        {reccomended.length==0 && (<h3>no reccomended manga</h3>)}
        {reccomended && reccomended.slice(currentIndex, currentIndex + 4).map((manga) => (
          <div key={manga.entry.title} className="manga-card">
            <Link to={`/manga/${encodeURIComponent(manga.entry.mal_id)}`}>
              <img src={manga.entry.images.webp.image_url} alt={manga.entry.title} />
              <h3>{manga.entry.title}</h3>
            </Link>
          </div>
        ))}
      </div>
      <div>
        {currentIndex > 0 && (
          <button onClick={handlePrev}>Previous</button>
        )}
        {(currentIndex + 4) < (reccomended && reccomended.length) && (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  )
}

export default ReccomendedManga;
