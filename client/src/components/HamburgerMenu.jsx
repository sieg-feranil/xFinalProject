import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import './HamburgerMenu.css'

function HamburgerMenu() {
    const [sidebar, setSidebar] = useState(false);
    const [allGenres, setAllGenres] = useState([])
    const [showGenres, setShowGenres] = useState(false);
    const navigate = useNavigate();
  
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
        <div className="navbar">
          <Link to="#" className="menu-bars" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </Link>
        </div>
        <nav className={sidebar ? 'hamburger-menu active' : 'hamburger-menu'}>
          <div className="hamburger-menu-items">
         
              <button className="hamburger-text" onClick={handleGenreToggle}>
                Genres
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
    
            <button className="hamburger-text" 
            onClick={() => navigate('/favourites')} >Favourites</button>
            <button className="hamburger-text"
            onClick={() => navigate('/manga/random')} >Random Manga</button>
          </div>
          <footer>
            <img id="Yui" alt="waifu" src="/pngegg.png" />
          </footer>
        </nav>
      </>
    )
  }


  export default HamburgerMenu