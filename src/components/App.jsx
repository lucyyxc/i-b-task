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
import Payment from './Payment';
import Loading from './Loading';

const App = ({selected}) => {
  const [state, setState] = React.useState({
    error: null,
    loading: true, //TODO set to true when done
    dateFilter: '',
    dateStart: new Date(),
    dateEnd: '',
    taskFilter: '',
    search: '',
    tasks: [],
    user: {},
  });

  // if(!_isEmpty(state.user) && !state.user.sub) {
  //   const isNewSub = window.location.href.split("?")[1] === 'success=true';

  // }
  

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
        dateEnd: new Date(state.user.weddingdate),
      });
    } else {
      setState({
        ...state,
        dateFilter: filter,
      });
    }
  }
  
  const getUserTasks = () => {
    axios.get('/api/get/userTasks')
    .then(response => {
      setState({
        ...state,
        tasks: response.data
      })
    })
  }

  const displayView = () => {
    switch (selected) {
      case 'calendar':
        return <Calendar {...state} selected={selected} getUserTasks={getUserTasks} />
      case 'progress':
        return <Progress {...state} selected={selected} getUserTasks={getUserTasks} />
      case 'files':
        return <Files />
      case 'payment':
        return <Payment updateView={updateStateValue} getUserTasks={getUserTasks} />
      case 'loading':
        return <Loading />
      case 'checklist':
        return <Checklist {...state} selected={selected} getUserTasks={getUserTasks} />
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
        const view = user.sub === true ? 'checklist' : 'payment';
        setState({
          ...state,
          user,
          tasks,
          loading: false,
          dateEnd: new Date(user.weddingdate),
          selected: view
        });
      } else (
        setState({
          ...state,
          loading: false,
          error: data,
        })
      )
    };

    if(state.loading === true &&
      state.error === null &&
      (!_isEmpty(state.user) || !state.tasks.length)) {
      const userCall = axios.get('/api/get/user');
      const tasksCall = axios.get('/api/get/userTasks')
      axios.all([userCall, tasksCall])
        .then(responses => {
          updateState({user: responses[0].data, tasks: responses[1].data})
        })
        .catch(err => {
          updateState(err);
        })
    }
  });


  return (
    <div className="App">
      <Nav selected={selected} />
      {selected === 'loading' ? null : <Title {...state} />}
      <Footer />
      
      {selected === 'loading'
        ? null
        : <>
          <Search
            search={state.search}
            updateStateValue={updateStateValue}
            collabadded={_get(state, 'user.collabadded', false)}
            showSearch={selected === 'checklist' || selected === 'files'}
          />
          <div className="views-holder">
            <div className="views-content">
              <Views
                {...state}
                updateStateValue={updateStateValue}
                selected={selected}
              />
              {selected === 'checklist'
                ? <Filters
                    {...state}
                    selected={selected}
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
