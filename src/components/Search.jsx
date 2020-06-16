import React from 'react';

const Search = ({search, updateStateValue}) => (
  <div className="Search">
    <div className="search-content">
      <i className="fas fa-user-plus"></i>
      <i className="fas fa-plus-circle"></i>
      <i className="far fa-question-circle"></i>
      <div className="search-input">
        <i className="fas fa-search"></i>
        <input placeholder="search"
          value={search}
          onChange={e => updateStateValue('search', e.target.value)}
        />
      </div>
    </div>
  </div>
);

export default Search;