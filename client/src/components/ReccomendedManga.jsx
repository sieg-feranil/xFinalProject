import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function ReccomendedManga() {
  const [reccomended, setReccomended] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mal_id } = useParams();

  async function fetchData() {
    try {
      const response = await axios.get(`http://localhost:3000/manga/${encodeURIComponent(mal_id)}/recommendations`);
      const data = response.data;
      setReccomended(data);
      // console.log(data, mal_id);
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
// console.log(currentIndex, reccomended);
  return (
    <div>
      <div className="manga-list">
        {reccomended && reccomended.slice(currentIndex, currentIndex + 4).map((manga) => (
          <div key={manga.entry.title} className="manga-card">
            <Link to={`/manga/${encodeURIComponent(manga.entry.mal_id)}`}>
              <img src={manga.entry.images.webp.image_url} alt={manga.entry.title} />
              <h4>{manga.entry.title}</h4>
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
