import React from 'react';
import LogoComponent from '../../Components/Header/LogoComponent';
import SearchComponent from '../../Components/Header/SearchComponent';
import UserInfoComponent from '../../Components/Header/UserInfoComponent';
import '../../Components/Header/Header.css';

const HeaderContainer = () => {
  return (
    <header className="top_header">
      <LogoComponent />
      <SearchComponent />
      <UserInfoComponent />
    </header>
  );
};

export default HeaderContainer;