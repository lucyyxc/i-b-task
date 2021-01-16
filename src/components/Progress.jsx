import React from 'react';
import moment from 'moment';

const getPercent = (num, total) => {
  return Math.round(num / total * 100)
}

const Item = ({text, color}) => (
  <div className="item">
    <div className={`color ${color}`}></div>
    <div className="legend-label">{text}</div>
  </div>
);

const Section = ({color, num, total}) => {
  let text;
  
  switch (color) {
    case 'complete':
      text = "Completed Tasks";
      break;
    case 'in-progress':
      text = "In Progress Tasks";
      break;
    default:
      text = "Not Started Tasks";
      break;
  };
  
  return (
    <div 
      className={`section ${color}`}
      style={{'width': `${getPercent(num, total)}%`}}
      title={`${text}: ${num} (${getPercent(num, total)}%)`}
    >
    </div>
  );
};

const Circle = ({color = '', text, big = '', num}) => (
  <div className="circle">
    <div className={`the-circle ${color} ${big}`}><p>{num}</p></div>
    <span>{text}</span>
  </div>
);


const Progress = ({tasks}) => {
  const [state, setState] = React.useState({
    pastDue: 0,
    dueToday: 0,
    inProgress: 0,
    totalCompleted: 0,
    totalToGo: 0,
  });

  if (tasks.length) {
    let amounts = { //TODO set back to 0s when done
      pastDue: 0,
      dueToday: 0,
      inProgress: 0,
      totalCompleted: 0,
      totalToGo: 0,
    };
    
    tasks.forEach(task => {
      switch (task.status) {
        case 'complete':
          amounts.totalCompleted++;
          break;
        case 'in-progress':
          amounts.inProgress++;
          amounts.totalToGo++
          break;
        default:
          amounts.totalToGo++;
          break;
      };

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
      setState(amounts)
    }
  }

  const totalTasks = state.totalCompleted + state.totalToGo;

  return (
    <div className="Progress" >
      <h3 className="title" >Progress as of {moment().format("dddd, MMMM Do, YYYY")}</h3>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <Section color={'complete'} num={state.totalCompleted} total={totalTasks} />
          <Section color={'in-progress'} num={state.inProgress} total={totalTasks} />
          <Section color={'not-started'} num={state.totalToGo - state.inProgress} total={totalTasks} />
        </div>
      </div>
      <div className="legend">
        <Item text={'Completed Tasks'} color={'complete'} />
        <Item text={'In Progress Tasks'} color={'in-progress'} />
        <Item text={'Not Started Tasks'} color={'not-started'} />
      </div>
      <div className="circle-container"> {/*TODO make this mobile friendly */}
        <div className='flex'>
          <Circle text={'Tasks past due.'} num={state.pastDue} />
          <Circle text={'Tasks due today.'} num={state.dueToday} big={'big'}/>
          <Circle text={'Tasks in progress'} num={state.inProgress} color={'in-progress'} />
        </div>
        <div className='flex'>
          <Circle text={'Total tasks complete'} num={state.totalCompleted} color={'complete'} />
          <Circle text={'Total tasks to go'} num={state.totalToGo} />
        </div>
        
      </div>
    </div>
  );
};

export default Progress;
