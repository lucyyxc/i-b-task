import React from 'react';
import axios from 'axios';
import _isEmpty from 'lodash/isEmpty'

import Nav from './Nav';
import Footer from './Footer';
import Title from './Title';
import Search from './Search';
import Views from './Views';
import Filters from './Filters';

const App = () => {
  
  const [state, setState] = React.useState({
    user: {},
    tasks: [],
    loading: true,
    error: null
  });

  React.useEffect(() => {
    const updateState = (data) => {
      const user = data.user || {};
      const tasks = data.tasks || {};
      if (!_isEmpty(user) && !_isEmpty(tasks)) {
        setState({
          ...state,
          user,
          tasks,
          loading: false,
        });
      } else (
        setState({
          ...state,
          loading: false,
          error: data,
        })
      )
      
    };

    if(state.loading === true && state.error === null) {
      axios.get('http://localhost:3333/api/get')
        .then( response => {
          updateState(response.data);
        })
        .catch(err => {
          updateState(err);
        })
    }
  
  });

  return (
    <div className="App">
      <Nav />
      <Title {...state} />
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
};

export default App;
