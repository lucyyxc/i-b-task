import React from 'react';
import moment from 'moment-timezone';

const getPercent = (num, total) => {
  return Math.round((num / total) * 100);
};

const Item = ({ text, color }) => (
  <div className='item'>
    <div className={`color ${color}`}></div>
    <div className='legend-label'>{text}</div>
  </div>
);

const Section = ({ color, num, total }) => {
  let text;

  switch (color) {
    case 'complete':
      text = 'Tasks Completed';
      break;
    case 'in-progress':
      text = 'Tasks In Progress';
      break;
    default:
      text = 'Tasks Not Started';
      break;
  }

  return (
    <div
      className={`section ${color}`}
      style={{ width: `${getPercent(num, total)}%` }}
      title={`${text}: ${num} (${getPercent(num, total)}%)`}
    ></div>
  );
};

const Circle = ({ color = '', text, big = '', num }) => (
  <div className='circle'>
    <div className={`the-circle ${color} ${big}`}>
      <p>{num}</p>
    </div>
    <span>{text}</span>
  </div>
);

const Progress = ({ tasks }) => {
  const [state, setState] = React.useState({
    pastDue: 0,
    dueToday: 0,
    inProgress: 0,
    totalCompleted: 0,
    totalToGo: 0,
  });

  const notArchivedTasks = tasks.filter((task) => !task.archived);

  if (notArchivedTasks.length) {
    let amounts = {
      pastDue: 0,
      dueToday: 0,
      inProgress: 0,
      totalCompleted: 0,
      totalToGo: 0,
    };

    notArchivedTasks.forEach((task) => {
      switch (task.status) {
        case 'complete':
          amounts.totalCompleted++;
          break;
        case 'in-progress':
          amounts.inProgress++;
          amounts.totalToGo++;
          break;
        default:
          amounts.totalToGo++;
          break;
      }

      switch (true) {
        case moment(task.enddate).isBefore(moment()):
          amounts.pastDue++;
          break;
        case moment(task.enddate).isSame(moment(), 'day'):
          amounts.dueToday++;
          break;
        default:
          break;
      }
    });

    if (JSON.stringify(state) !== JSON.stringify(amounts)) {
      setState(amounts);
    }
  }

  const totalTasks = state.totalCompleted + state.totalToGo;

  return (
    <div className='Progress'>
      <h3 className='title'>
        Progress as of{' '}
        {moment().tz(moment.tz.guess()).format('dddd, MMMM Do, YYYY')}
      </h3>
      <div className='progress-bar-container'>
        <div className='progress-bar'>
          <Section
            color={'complete'}
            num={state.totalCompleted}
            total={totalTasks}
          />
          <Section
            color={'in-progress'}
            num={state.inProgress}
            total={totalTasks}
          />
          <Section
            color={'not-started'}
            num={state.totalToGo - state.inProgress}
            total={totalTasks}
          />
        </div>
      </div>
      <div className='legend'>
        <Item text={'Tasks Completed'} color={'complete'} />
        <Item text={'Tasks In Progress'} color={'in-progress'} />
        <Item text={'Tasks Not Started'} color={'not-started'} />
      </div>
      <div className='circle-container'>
        {' '}
        {/*TODO make this mobile friendly */}
        <div className='flex desktop'>
          <Circle
            text={'Tasks Past Due'}
            num={state.pastDue}
            color={'tasks-past-due'}
          />
          <Circle text={'Tasks Due Today'} num={state.dueToday} big={'big'} />
          <Circle
            text={'Tasks In Progress'}
            num={state.inProgress}
            color={'in-progress'}
          />
        </div>
        <div className='flex mobile'>
          <Circle text={'Tasks Due Today'} num={state.dueToday} big={'big'} />
        </div>
        <div className='flex bottom mobile'>
          <Circle
            text={'Tasks Past Due'}
            num={state.pastDue}
            color={'tasks-past-due'}
          />
          <Circle
            text={'Tasks In Progress'}
            num={state.inProgress}
            color={'in-progress'}
          />
        </div>
        <div className='flex bottom'>
          <Circle
            text={'Tasks Completed'}
            num={state.totalCompleted}
            color={'complete'}
          />
          <Circle
            text={'Tasks Not Started'}
            num={state.totalToGo - state.inProgress}
            color={'not-started'}
          />
        </div>
      </div>
    </div>
  );
};

export default Progress;
