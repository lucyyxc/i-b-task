import React from 'react';
import axios from 'axios';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import { ToastContainer, Slide } from 'react-toastify';
import moment from 'moment';

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
import MobileHeader from './MobileHeader';

const App = ({selected}) => {
  const [state, setState] = React.useState({
    error: null,
    loading: true, //TODO set to true when done
    dateFilter: '',
    dateStart: new Date(),
    dateEnd: '',
    taskFilter: 'incomplete',
    search: '',
    tasks: [],
    user: {},
  });

  if (!_isEmpty(state.user) && !state.user.sub && ( window.location.href.split('?')[1]) === 'success=true' ) {
    axios.post('/api/post/subUpdate', {sub: true})
    .then(response => {
    })
    .catch(err => console.log('update sub error', err));
  }
  

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
        dateEnd: new Date(moment(new Date()).add(30, 'days').format('YYYY-MM-DD')),
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

  const getUserInfo = () => {
    const userCall = axios.get('/api/get/user');
    const tasksCall = axios.get('/api/get/userTasks')
    axios.all([userCall, tasksCall])
      .then(responses => {
        setState({
          ...state,
          user: responses[0].data, 
          tasks: responses[1].data
        })
      })
      .catch(err => {
        setState({
          ...state,
          loading: false,
          error: err,
        })
      })
  }

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  }

  const displayView = () => {
    switch (selected) {
      case 'calendar':
        return <Calendar {...state} selected={selected} getUserTasks={getUserTasks} handleDateChangeRaw={handleDateChangeRaw} />
      case 'progress':
        return <Progress {...state} selected={selected} getUserTasks={getUserTasks} />
      case 'files':
        return <Files />
      case 'payment':
        return <Payment updateView={updateStateValue} getUserTasks={getUserTasks} />
      case 'loading':
        return <Loading />
      case 'checklist':
        return <Checklist {...state} selected={selected} getUserTasks={getUserTasks} handleDateChangeRaw={handleDateChangeRaw} />
      default:
        return <Checklist {...state} selected={selected} getUserTasks={getUserTasks} handleDateChangeRaw={handleDateChangeRaw} />
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
          dateEnd: new Date(moment(new Date()).add(30, 'days').format('YYYY-MM-DD')),
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
        console.log('good');
        updateState({user: responses[0].data, tasks: responses[1].data})
      })
      .catch(err => {
        if (err.response.data) {
          window.location.href = `${process.env.REACT_APP_SERVERHOST}/auth/logout`
        } else {
          updateState(err);
        }
      })
    }
  });

  return (
    <div className="App">
      <Nav selected={selected} user={state.user} loading={state.loading} error={state.error} getUserTasks={getUserTasks} getUserInfo={getUserInfo} handleDateChangeRaw={handleDateChangeRaw} />
      {selected === 'loading' ? null : <Title {...state} />}
      <Footer />
      <MobileHeader 
        getUserTasks={getUserTasks}
        getUserInfo={getUserInfo}
        tasksLength={state.tasks.length}
        taskFilter={state.taskFilter}
        updateStateValue={updateStateValue}
        user={state.user}
        selected={selected}
        handleDateChangeRaw={handleDateChangeRaw}
      />
      
      {selected === 'loading'
        ? null
        : <>
          <Search
            search={state.search}
            updateStateValue={updateStateValue}
            collabadded={_get(state, 'user.collabadded', false)}
            showSearch={selected === 'checklist' || selected === 'files'}
            handleDateChangeRaw={handleDateChangeRaw}
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
                    handleDateChangeRaw={handleDateChangeRaw}
                  />
                : null
              }
              </div>
            </div>
          </>
      }
      {displayView()}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        transition={Slide}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
