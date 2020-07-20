import React from 'react';

const Search = ({search, updateStateValue}) => (
  <div className="Search">
    <div className="search-content">
      <i className="fas fa-user-plus"></i> {/*TODO add in ability to add another user */}
      <i className="fas fa-plus-circle"></i> {/*TODO add in ability to add another task */}
      <i className="far fa-question-circle"></i> {/*TODO add in how it works info */}
      <div className="search-input">
        <i className="fas fa-search"></i>
        <input placeholder="search"
          value={search}
          onChange={e => updateStateValue('search', e.target.value) /*TODO add in term searching */} 
        />
      </div>
    </div>
  </div>
);

export default Search;
