import React from 'react';
import moment from 'moment';

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
      pastDue: 2,
      dueToday: 1,
      inProgress: 5,
      totalCompleted: 20,
      totalToGo: 12,
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
        case moment(task.endDate).isBefore(moment()):
          amounts.pastDue++;
          break;
        case moment(task.endDate).isSame(moment(), 'day'):
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

  const getPercent = (num, total) => {
    return Math.round(num / total * 100)
  }

  return (
    <div className="Progress" >
      <h3 className="title" >Progress as of {moment().format("dddd, MMMM Do, YYYY")}</h3>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="section complete" style={{'width': `${getPercent(state.totalCompleted, state.totalCompleted + state.totalToGo)}%`}}></div>
          <div className="section in-progress" style={{'width': `${getPercent(state.inProgress, state.totalCompleted + state.totalToGo)}%`}}></div>
          <div className="section not-started" style={{'width': `${getPercent(state.totalToGo - state.inProgress, state.totalCompleted + state.totalToGo)}%`}}></div>
        </div>
        <div className="rule twentyfive"></div>
        <div className="rule fifty"></div>
        <div className="rule seventyfive"></div>
        <div className="label twentyfive">25%</div>
        <div className="label fifty">50%</div>
        <div className="label seventyfive">75%</div>
      </div>
      <div className="legend">
        <div className="item">
          <div className="color complete"></div>
          <div className="legend-label">Completed Tasks</div>
        </div>
        <div className="item">
          <div className="color in-progress"></div>
          <div className="legend-label">In Progress Tasks</div>
        </div>
        <div className="item">
          <div className="color not-started"></div>
          <div className="legend-label">Not Started Tasks</div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
