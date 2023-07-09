import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';


const Home1 = () => {
  const { categID, categName, page: pageParam } = useParams();
  const [mangaData, setMangaData] = useState({});
  const [page, setPage] = useState(Number(pageParam) || 1);
  const [categPage, setCategPage] = useState(Number(pageParam) || 1);
  const [hasNextPage, setHasNextPage] = useState(false)
  const navigate = useNavigate();


  let URL = `https://api.jikan.moe/v4/top/manga?page=${page}&limit=24`;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
      setHasNextPage(data.pagination.has_next_page)

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
      navigate(`/category/${categID}/${categName}/page/${categPage + 1}`);
    } else {
      setPage(page + 1);
      navigate(`/page/${page + 1}`);
    }

  };

  const handlePrevPage = () => {
    if (categID) {
      if (categPage > 1) {
        setCategPage(categPage - 1);
        navigate(`/page/${categPage - 1}`);
      }
    } else {
      if (page > 1) {
        setPage(page - 1);
        navigate(`/page/${page - 1}`);
      }
    }
  };

  return (
    <div>
      {categID ? (<h4>{categName}</h4>) : (<h4>TOP RATED MANGA</h4>)}
      <div>
        {page !== 1 && (<button onClick={handlePrevPage}>-</button>)}
        <span> {categID ? categPage : page}</span>
        {hasNextPage && (<button onClick={handleNextPage}>+</button>)}
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
        {page !== 1 && (<button onClick={handlePrevPage}>-</button>)}
        <span> {categID ? categPage : page}</span>
        {hasNextPage && (<button onClick={handleNextPage}>+</button>)}
      </div>
    </div>
  );
};

export default Home1;