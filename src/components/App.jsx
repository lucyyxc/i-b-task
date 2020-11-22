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
import Payment from './Payment';
import Loading from './Loading';


const userOne = {
  name: 'Bri Holst',
  email: 'BH@IB.com',
  assignee: 'BH',
  id: '1357',
  weddingDate: '2021-05-28',
  birthday: '1950-01-01',
  collabAdded: false,
  collabID: null
}

const tasksOne = [
  {
    id: '01',
    userId: '1357',
    taskName: 'guest-list',
    taskLabel: 'Guest List',
    assignee: 'BH',
    tags: '',
    startDate: '2020-11-20',
    endDate: '2020-11-24',
    status: 'in-progress',
    custom: false,
    details: {
      advice: 'You should get this done',
      notes: 'I should get this done.',
      pintrest: 'https://www.pinterest.com/',
      blog: 'https://twitter.com/',
      moneyTip: 'Spend less moneys'
    }
  },
  {
    id: '02',
    userId: '1357',
    taskName: 'create-budget',
    taskLabel: 'Create Budget',
    assignee: 'DP',
    tags: '',
    startDate: '2020-11-16',
    endDate: '2020-11-20',
    status: 'complete',
    custom: false,
    details: {
      advice: 'You should really get this done',
      notes: 'I should really get this done.',
      pintrest: 'https://www.pinterest.com/',
      blog: 'https://twitter.com/',
      moneyTip: 'Spend more moneys'
    }
  },
  {
    id: '03',
    userId: '1357',
    taskName: 'research-venue',
    taskLabel: 'Research Venue Space',
    assignee: 'BH',
    tags: '',
    startDate: '2020-11-19',
    endDate: '2020-11-22',
    status: 'not-started',
    custom: 'false',
    details: {
      advice: 'This should probably get this done',
      notes: 'I think I should probably get this done.',
      pintrest: 'https://www.pinterest.com/',
      blog: 'https://twitter.com/',
      moneyTip: '',
    }
  }
]

const App = ({selected}) => {
  const [state, setState] = React.useState({
    error: null,
    loading: false, //TODO set to true when done
    dateFilter: '',
    dateStart: new Date(),
    dateEnd: '',
    taskFilter: '',
    search: '',
    tasks: tasksOne,
    user: userOne,
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

  // React.useEffect(() => {
  //   const updateState = (data) => {
  //     const user = data.user || {};
  //     const tasks = data.tasks || {};
  //     if (!_isEmpty(user) && !_isEmpty(tasks)) {
  //       const view = user.sub === true ? 'checklist' : 'payment';
  //       setState({
  //         ...state,
  //         user,
  //         tasks,
  //         loading: false,
  //         dateEnd: new Date(user.weddingDate),
  //         selected: view
  //       });
  //     } else (
  //       setState({
  //         ...state,
  //         loading: false,
  //         error: data,
  //       })
  //     )
  //   };

  //   let email;

  //   if (!_isEmpty(user) && _isEmpty(state.user)) {
  //     email = user.email;
  //   } else if (!_isEmpty(state.user)) {
  //     email = state.user.email;
  //   }

  //   if(state.loading === true &&
  //     state.error === null &&
  //     selected !== 'payment' &&
  //     (!_isEmpty(user) || _get(state, 'user.email', false))) {
  //     axios.get(`http://localhost:3333/api/get/${email}`)
  //       .then( response => {
  //         updateState(response.data);
  //       })
  //       .catch(err => {
  //         updateState(err);
  //       })
  //   }
  // });

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
            collabAdded={_get(state, 'user.collabAdded', false)}
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
