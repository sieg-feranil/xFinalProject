import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Home1 from './components/MangaHome';
import HamburgerMenu from './components/HamburgerMenu';
import SearchBar from './components/Searchbar';
import FavPage from './components/FavPage';
import RandomManga from './components/RandomManga';
import SingleManga1 from './components/SingleManga';
import UserMenu from './components/UserMenu';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/Login';
import MangaResults from './components/SearchResults';

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogoClick = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      window.location.href = "/";
    }
  };

  console.log(isLoggedIn);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('jwtToken');
    if (storedToken) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <div className="app">

      <header className="header">
        <HamburgerMenu />
        <div className="logo">
          <Link to="/?page/?:page" onClick={handleLogoClick} >Manga App</Link>
        </div>
        <SearchBar />
        <UserMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </header>

      <Routes>
        <Route path="/" element={<Home1 />} />
        <Route path="/page/:page" element={<Home1 />} />
        <Route path="/category/:categID/:categName/page/:page" element={<Home1 />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/manga/:mal_id" element={<SingleManga1 isLoggedIn={isLoggedIn} />} />
        <Route path='/manga/random' element={<RandomManga isLoggedIn={isLoggedIn} />} />
        <Route path="/favourites" element={<FavPage isLoggedIn={isLoggedIn} />} />
        <Route path="/results/:mangaName/page/:page" element={<MangaResults/>} />
      </Routes>
    </div>
  );
};

export default App;
