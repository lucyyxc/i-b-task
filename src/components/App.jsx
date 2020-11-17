import React from 'react';
import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

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
import Intro from './Intro';

import { useAuth0 } from '@auth0/auth0-react';

const App = () => {
  const [state, setState] = React.useState({
    error: null,
    loading: true,
    selected: 'intro', // TODO Make sure default is what it should be done
    dateFilter: '',
    dateStart: new Date(),
    dateEnd: '',
    taskFilter: '',
    search: '',
    tasks: [],
    user: {},
  });
  
  const { user, isLoading, isAuthenticated } = useAuth0();

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
        return <Progress {...state} />
      case 'files':
        return <Files />
      case 'checklist':
        return <Checklist {...state} />
      case 'intro':
        return <Intro updateView={updateStateValue} />
      default:
        {/*TODO change this to error page or something when decided. */}
        return null
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

  if (!isLoading && isAuthenticated && state.selected === 'intro') {
    updateStateValue('selected', 'checklist')
  } else if (!isLoading && !isAuthenticated && state.selected !== 'intro') {
    updateStateValue('selected', 'intro')
  }

  return (
    <div className="App">
      <Nav selected={state.selected} />
      <Title {...state} />
      <Footer />
      
      {state.selected === 'intro'
        ? null
        : <>
          <Search
            search={state.search}
            updateStateValue={updateStateValue}
            collabAdded={_get(state, 'user.collabAdded', false)}
            showSearch={state.selected === 'checklist' || state.selected === 'files'}
          />
          <div className="views-holder">
            <div className="views-content">
              <Views
                {...state}
                updateStateValue={updateStateValue}
              />
              {state.selected === 'checklist'
                ? <Filters
                    {...state}
                    updateDateFilter={updateDateFilter}
                    updateStateValue={updateStateValue}
                  />
                : null
              }
              </div>
            </div>
          </>
      }
      {displayView()}
    </div>
  );
};

export default App;
