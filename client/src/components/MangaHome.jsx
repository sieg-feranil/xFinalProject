import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './MangaHome.css'

const Home1 = () => {
  const { categID, categName, page: pageParam } = useParams();
  const [mangaData, setMangaData] = useState({});
  const [page, setPage] = useState(Number(pageParam) || 1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  let URL = `https://api.jikan.moe/v4/top/manga?page=${page}&limit=24`;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (categID) {
      URL = `https://api.jikan.moe/v4/manga?genres=${categID}&page=${page}&limit=24`;
    } else {
      URL = `https://api.jikan.moe/v4/top/manga?page=${page}&limit=24`;
    }
  }, [categID, page]);

  async function fetchData() {
    try {
      setLoading(true)
      const response = await axios.get(URL);
      const data = response.data;
      setMangaData(data);
      setHasNextPage(data.pagination.has_next_page);
      if(data.pagination.items.count==0) navigate('/error404')
      setLoading(false); 
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setLoading(true);
        await delay(400);
        await fetchData();
      } else {
        console.log(error);
        setLoading(false); 
      }
    }
  }


  useEffect(() => {
    fetchData();
  }, [page, categID]);

  const handleNextPage = () => {
    if (categID) {
      setPage(page + 1);
      navigate(`/category/${categID}/${categName}/page/${page + 1}`);
    } else {
      setPage(page + 1);
      navigate(`/page/${page + 1}`);
    }
  };

  const handlePrevPage = () => {
    if (categID) {
      if (page > 1) {
        setPage(page - 1);
        navigate(`/category/${categID}/${categName}/page/${page - 1}`);
      }
    } else {
      if (page > 1) {
        setPage(page - 1);
        navigate(`/page/${page - 1}`);
      }
    }
  };


  

  if (loading) {
    return (
      <div className='mangaDisplay'>
        {categID ? <h3>{categName}</h3> : <h3>TOP RATED MANGA</h3>}
        <div className='pageControl'>
          {page !== 1 ? (
            <button onClick={() => alert('chill')}>-</button>
          ) : (
            <img id="noPrev" alt="umaru" src='/umaru.png'/>
          )}
          <span> {page}</span>
          {hasNextPage ? (<button onClick={() => alert('are you in a hurry?')}>+</button>
                    ) : (<img id="noPrev" alt="slamDunk" src='/slamDunk.png' />)}
        </div>
        <div className='loaderContainer'>
          <img className='loader' src="/moon_soul_eater.png" alt="a" />
          <h3>loading..</h3>
        </div>
      </div>
    )
  }

  return (
    <div className='mangaDisplay'>
      {categID ? <h3>{categName}</h3> : <h3>TOP RATED MANGA</h3>}
      <div className='pageControl'>
        {page !== 1 ? (
          <button onClick={handlePrevPage}>-</button>
        ) : (
          <img id="noPrev" alt="umaru" src='/umaru.png'/>

        )}
        <span> {page}</span>
        {hasNextPage ? (<button onClick={handleNextPage}>+</button>
                    ) : (<img id="noPrev" alt="kyo" src='/kyo.png' />)}
      </div>
      <div className="manga-list">
        {mangaData.data &&
          mangaData.data.map((manga, i) => (
            <div key={manga.title + ''+i} className="manga-card">
              <Link to={`/manga/${encodeURIComponent(manga.mal_id)}`}>
                <img src={manga.images.webp.image_url} alt={manga.title} />
                <h4>{manga.title}</h4>
                <span>RANK:{manga.rank}</span>
                <span>SCORE:{manga.score}</span>
              </Link>
            </div>
          ))}
      </div>
      <div className='pageControl'>
        {page !== 1 ? (
          <button onClick={handlePrevPage}>-</button>
        ) : (
          <img id="noPrev" alt="char" src='/char.png'/>
        )}
        <span> {page}</span>
        {hasNextPage ? (<button onClick={handleNextPage}>+</button>
                    ) : (<img id="noPrev" alt="slamDunk" src='/slamDunk.png' />)}
      </div>
    </div>
  );
};

export default Home1;
