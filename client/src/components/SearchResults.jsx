import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const MangaResults = () => {
    const { page: pageParam, mangaName } = useParams();
    const [mangaData, setMangaData] = useState([]);
    const [page, setPage] = useState(Number(pageParam) || 1);
    const [hasNextPage, setHasNextPage] =useState(false)

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    async function fetchData() {
        try {

            const response = await axios.get(
                `https://api.jikan.moe/v4/manga?q=${mangaName}&cat=manga&page=${page}&limit=24`
            );
            const { data } = response;
            console.log(response);
            setMangaData(data.data);
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
    }, [page, mangaName]);


    const handleNextPage = () => {
        setPage(page + 1);
        navigate(`/results/${mangaName}/page/${page + 1}`);
    };

    const handlePrevPage = () => {
        setPage(page - 1);
        navigate(`/results/${mangaName}/page/${page - 1}`);
    }

    return (
        <div>
            <h2>Results for "{mangaName}"</h2>
            <div>
                {page!==1 && (<button onClick={handlePrevPage}>-</button>)}
                <span>{ page }</span>
                {hasNextPage && ( <button onClick={handleNextPage}>+</button>)}
            </div>
            <div className="manga-list">
                {mangaData.map((manga) => (
                    <Link to={`/manga/${encodeURIComponent(manga.mal_id)}`} key={manga.mal_id}>
                        <div className="manga-card">
                            <img src={manga.images.webp.image_url} alt={manga.title} />
                            <h3>{manga.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
            <div>
                {page!==1 && (<button onClick={handlePrevPage}>-</button>)}
                <span>{ page }</span>
                {hasNextPage && ( <button onClick={handleNextPage}>+</button>)}
            </div>
        </div>
    );
};

export default MangaResults;
