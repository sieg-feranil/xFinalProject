import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';


const Home1 = () => {
  const { categID, categName } = useParams();
  const [mangaData, setMangaData] = useState({});
  const [page, setPage] = useState(1);
  const [categPage, setCategPage] = useState(1);

  let URL = `https://api.jikan.moe/v4/top/manga?page=${page}&limit=24`;

  useEffect(() => {
    if (categID) {
      URL = `https://api.jikan.moe/v4/manga?genres=${categID}&page=${categPage}&limit=24`;
    } else {
      URL = `https://api.jikan.moe/v4/top/manga?page=${page}&limit=24`;
    }
  }, [categID, categPage, page]);


  async function fetchData() {
    try {
      const response = await axios.get(URL);
      const data = response.data;
      setMangaData(data);
    } catch (error) {
      if (error.response && error.response.status === 429) {

        await delay(400);
        await fetchData();

      } else {

        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, categPage, categID]);

  const handleNextPage = () => {
    if (categID) {
      setCategPage(categPage + 1);
    } else {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (categID) {
      if (categPage > 1) {
        setCategPage(categPage - 1);
      }
    } else {
      if (page > 1) {
        setPage(page - 1);
      }
    }
  };

  return (
    <div>
      {categID ? (<h4>{categName}</h4>) : (<h4>TOP RATED MANGA</h4>)}
      <div>
        <button onClick={handlePrevPage}>-</button>
        <span>{categID ? categPage : page}</span>
        <button onClick={handleNextPage}>+</button>
      </div>
      <div className="manga-list">
        {mangaData.data &&
          mangaData.data.map((manga) => (
            <div key={manga.title} className="manga-card">
              <Link to={`/manga/${encodeURIComponent(manga.mal_id)}`}>
                <img src={manga.images.webp.image_url} alt={manga.title} />
                <span>{manga.rank}</span>
                <h4>{manga.title}</h4>
              </Link>
            </div>
          ))}
      </div>
      <div>
        <button onClick={handlePrevPage}>-</button>
        <span>{categID ? categPage : page}</span>
        <button onClick={handleNextPage}>+</button>
      </div>
    </div>
  );
};

export default Home1;