// components/Header.js
import {React, useEffect, useState} from 'react';
import './Header.css';
import { logout } from '@/utils/session';

const Header = () => {
  const [userName,setUserName] = useState();


  useEffect(() => {
    const username = localStorage.getItem("username");
    setUserName(username);
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    return name.substring(0, 2).toUpperCase(); // Get first 2 letters and make uppercase
  };

  return (
    <header className="header">
      <h1>Canvas Pro</h1>
      <div className="profile">
        <div className="profile-logo">
          {getInitials(userName)}
        </div>
        <button className="logout-button" onClick={logout}>LogOut</button>
      </div>
  </header>
  );
};

export default Header;
