import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import Title from './Title';
import Search from './Search';
import Views from './Views';
import Filters from './Filters';

const App = () => (
  <div className="App">
    <Nav />
    <Title />
    <Footer />
    <Search />
    <div className="views-holder">
      <div className="views-content">
        <Views />
        <Filters />
      </div>
    </div>
  </div>
);

export default App;
