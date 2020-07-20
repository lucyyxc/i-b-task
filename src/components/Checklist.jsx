import React from 'react';
import _forIn from 'lodash/forIn'

import Task from './Task';

const Checklist = ({tasks}) => {
  const [state, setState] = React.useState({
    taskLabel: '',
    assignee: '',
    tags: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  const renderArrows = (column => {
    switch (state[column]) {
      case 'ASC':
        return <i className="fas fa-sort-up"></i>;
      case 'DEC':
       return <i className="fas fa-sort-down"></i>;
      default:
        return <></>;
    };
  });

  const updateFilterState = (column) => {
    const filter = state[column] === ''
      ? 'DEC'
      : (
        state[column] === 'DEC'
        ? 'ASC'
        : 'DEC'
      );
    setState({
      taskLabel: '',
      assignee: '',
      tags: '',
      startDate: '',
      endDate: '',
      status: '',
      [column]: filter
    });
  };

  let filteredTasks = tasks;

  const taskFilter = (value, key) => {
    filteredTasks = tasks.sort((a, b) => {
      if (value === "DEC") {
        if (a[key] > b[key]) return -1
        if (a[key] < b[key]) return 1
      } else {
        if (a[key] > b[key]) return 1
        if (a[key] < b[key]) return -1
      }
      return 0;
    });
  };

  if (tasks){
     _forIn(state, (value, key) => {
      if (value != false) {
        taskFilter(value, key)
      }
    });
  }

  return (
    <div className="Checklist">
      <div className="checklist-header">
        <div
          className={`column ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('taskLabel')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Task
          </span>
          {renderArrows('taskLabel')}
        </div>
        <div
          className={`column ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('assignee')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Assignee
          </span>
          {renderArrows('assignee')}
        </div>
        <div
          className={`column ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('tags')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Tags
          </span>
          {renderArrows('tags')}
        </div>
        <div
          className={`column ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('startDate')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Start Date
          </span>
          {renderArrows('startDate')}
        </div>
        <div
          className={`column ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('endDate')}
        > {/*TODO hide with props when filtered out */}
        <span>
            End Date
          </span>
          {renderArrows('endDate')}
        </div>
        <div
          className={`column ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('status')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Status
          </span>
          {renderArrows('status')}
        </div>
      </div>
      {filteredTasks.map((e, i) => <Task task={e} index={i} key={e.id} />)}
    </div>
  );
};

export default Checklist;
