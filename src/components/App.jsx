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


const userOne = {
  name: 'Bri Holst',
  email: 'BH@IB.com',
  assignee: 'BH',
  id: '1357',
  weddingdate: '2021-05-28',
  birthday: '1950-01-01',
  collabadded: false,
  collabid: null
}

const tasksOne = [
  {
    id: '01',
    userid: '1357',
    taskname: 'guest-list',
    tasklabel: 'Guest List',
    assignee: 'BH',
    tags: '',
    startdate: '2020-12-20',
    enddate: '2020-12-24',
    status: 'in-progress',
    custom: false,
    advice: 'You should get this done',
    notes: 'I should get this done.',
    pintrest: 'https://www.pinterest.com/',
    blog: 'https://twitter.com/',
    moneytip: 'Spend less moneys',
    archived: false
  },
  {
    id: '02',
    userid: '1357',
    taskname: 'create-budget',
    tasklabel: 'Create Budget',
    assignee: 'DP',
    tags: '',
    startdate: '2020-12-16',
    enddate: '2020-12-20',
    status: 'complete',
    custom: false,
    advice: 'You should really get this done',
    notes: 'I should really get this done.',
    pintrest: 'https://www.pinterest.com/',
    blog: 'https://twitter.com/',
    moneytip: 'Spend more moneys',
    archived: false
  },
  {
    id: '03',
    userid: '1357',
    taskname: 'research-venue',
    tasklabel: 'Research Venue Space',
    assignee: 'BH',
    tags: '',
    startdate: '2020-12-19',
    enddate: '2020-12-22',
    status: 'not-started',
    custom: 'false',
    advice: 'This should probably get this done',
    notes: 'I think I should probably get this done.',
    pintrest: 'https://www.pinterest.com/',
    blog: 'https://twitter.com/',
    moneytip: '',
    archived: false
  }
]

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

  const displayView = () => {
    switch (selected) {
      case 'calendar':
        return <Calendar {...state} selected={selected} />
      case 'progress':
        return <Progress {...state} selected={selected} />
      case 'files':
        return <Files />
      case 'payment':
        return <Payment updateView={updateStateValue} />
      case 'loading':
        return <Loading />
      case 'checklist':
        return <Checklist {...state} selected={selected} />
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
          console.log('responses 0', responses[0].data);
          console.log('responses 1', responses[1].data);
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
