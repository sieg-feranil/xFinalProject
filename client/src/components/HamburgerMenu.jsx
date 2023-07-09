import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAngleDown } from '@fortawesome/free-solid-svg-icons'

function HamburgerMenu() {
    const [sidebar, setSidebar] = useState(false);
    const [allGenres, setAllGenres] = useState([])
    const [showGenres, setShowGenres] = useState(false);
  
    const URL = 'http://localhost:3000/genres'
    async function fetchData() {
      try {
        const response = await axios.get(URL);
        const data = response.data;
        setAllGenres(data);
      } catch (error) {
        console.log(error);
      }
    }
  
    const handleGenreClick = (id, name) => {
      console.log(id, name);
      if (window.location.pathname === `/category/${id}/${name}/page/1`) {
        window.location.reload();
      } else {
        window.location.href = `/category/${id}/${name}/page/1`;
      }
    };
  
    useEffect(() => {
      fetchData()
    }, [])
  
    const toggleSidebar = () => {
      setSidebar(!sidebar);
    };
  
  
    const handleGenreToggle = () => {
      setShowGenres(!showGenres);
    };
  
    return (
      <>
        <nav className="navbar">
          <Link to="#" className="menu-bars" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </Link>
        </nav>
        <nav className={sidebar ? 'hamburger-menu active' : 'hamburger-menu'}>
          <ul className="hamburger-menu-items">
            <li>
              <button className="hamburger-text" onClick={handleGenreToggle}>
                <span>Genres</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </button>
              {showGenres && (
                <ul className="genre-dropdown">
                  {allGenres.map((genre) => (
                    <li key={genre.id}>
                      <Link to={`/category/${genre.id}/${genre.name}`}
                        onClick={() => handleGenreClick(genre.id, genre.name)} >
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li><Link to={'/favourites'}>favourites</Link></li>
            <li><Link to={'/manga/random'}>random manga</Link></li>
          </ul>
          <footer>
            <img id="Yui" alt="waifu" src="/pngegg.png" />
          </footer>
        </nav>
      </>
    )
  }


  export default HamburgerMenu