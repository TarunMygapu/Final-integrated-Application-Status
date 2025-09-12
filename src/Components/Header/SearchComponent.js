import React from 'react';
import searchIcon from '../../Asserts/Header/Vector.svg';
import './Header.css';

const SearchComponent = () => {
  return (
    <div className="navsearch_item search_component">
      <div className="searchbar_flexleft">
        <div className="tophead_searchflex">
          <img src={searchIcon} alt="search icon" className="search_icon" />
          <input
            type="text"
            className="sc_topheader_input"
            placeholder="Ask for anything"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;