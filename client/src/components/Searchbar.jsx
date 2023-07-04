import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function SearchBar() {
    const [mangaName, setMangaName] = useState('');
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1)
    const selectRef = useRef(null);
    const inputRef = useRef(null);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${mangaName}&cat=manga&page=${page}&limit=25`);
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
            console.error(error);
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
            />
            <button onClick={handleSearch}>Search</button>

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
                    <li> <Link>show all results for {mangaName}</Link> </li>
                </ul>
            )}
        </div>
    );
}

export default SearchBar