import React from 'react';
import axios from 'axios';
import _isEmpty from 'lodash/isEmpty'

import Nav from './Nav';
import Footer from './Footer';
import Title from './Title';
import Search from './Search';
import Views from './Views';
import Filters from './Filters';
import Checklist from './Checklist';
import Calendar from './Calendar';
import Progress from './Progress';
import Files from './Files';

const App = () => {
  
  const [state, setState] = React.useState({
    error: null,
    loading: true,
    selected: 'checklist',
    dateFilter: '',
    dateStart: new Date(),
    dateEnd: '',
    taskFilter: '',
    search: '',
    tasks: [],
    user: {},
  });

  const updateStateValue = (key, value) => {
    setState({
      ...state,
      [key]: value
    });
  }

  const updateDateFilter = (filter) => {
    if (filter !== 'custom') {
      setState({
        ...state,
        dateFilter: filter,
        dateStart: new Date(),
        dateEnd: new Date(state.user.weddingDate),
      });
    } else {
      setState({
        ...state,
        dateFilter: filter,
      });
    }
    
  }

  const displayView = () => {
    switch (state.selected) {
      case 'calendar':
        return <Calendar />
      case 'progress':
        return <Progress />
      case 'files':
        return <Files />
      default:
        return <Checklist {...state} />
    }
  }

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
          dateEnd: new Date(user.weddingDate),
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
      <Search
        search={state.search}
        updateStateValue={updateStateValue}
      />
      <div className="views-holder">
        <div className="views-content">
          <Views
            {...state}
            updateStateValue={updateStateValue}
          />
          <Filters
            {...state}
            updateDateFilter={updateDateFilter}
            updateStateValue={updateStateValue}
          />
        </div>
      </div>
      {displayView()}
    </div>
  );
};

export default App;
