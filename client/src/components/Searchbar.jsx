import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

function SearchBar() {
    const [mangaName, setMangaName] = useState('');
    const [results, setResults] = useState([]);
    const selectRef = useRef(null);
    const inputRef = useRef(null);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${mangaName}&cat=manga&page=1&limit=25`);
            const { data } = response;

            const { pagination, data: mangaData } = data;
            const { items } = pagination;

            console.log(`Last Visible Page: ${items.count}`);
            console.log(`Has Next Page: ${items.has_next_page}`);
            console.log(`Current Page: ${pagination.current_page}`);
            console.log(`Items Count: ${items.count}`);
            console.log(`Total Items: ${items.total}`);
            console.log(`Items per Page: ${items.per_page}`);

            console.log(mangaData);

            setResults(mangaData);
            setDropdownVisible(true);
        } catch (error) {
            if (error.response && error.response.status === 429) {

                await delay(400);
                await fetchData();

            } else {

                console.log(error);
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClickOutside = (event) => {
        if (
            selectRef.current &&
            !selectRef.current.contains(event.target) &&
            inputRef.current &&
            !inputRef.current.contains(event.target)
        ) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown">
            <input
                type="text"
                value={mangaName}
                onChange={(e) => setMangaName(e.target.value)}
                placeholder="Search manga..."
                ref={inputRef}
                onClick={() => setDropdownVisible(true)}
                onKeyDown={handleKeyDown}
            />

            <button onClick={handleSearch}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>

            {isDropdownVisible && results.length > 0 && (
                <ul className="search-dropdown-list" ref={selectRef}>
                    {results.map((manga) => (
                        <Link to={`/manga/${encodeURIComponent(manga.mal_id)}`}>
                            <li key={manga.mal_id}>
                                <img src={manga.images.webp.small_image_url} alt={manga.title} />
                                {manga.title}
                            </li>
                        </Link>
                    ))}
                    <Link to={`/results/${encodeURIComponent(mangaName)}/page/1`}>Show All Results for {mangaName}</Link>

                </ul>
            )}
        </div>
    );
}

export default SearchBar