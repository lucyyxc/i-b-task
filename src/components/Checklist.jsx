import React from 'react';

import Task from './Task';

const Checklist = ({tasks}) => {
  const [state, setState] = React.useState({
    task: '',
    assignee: '',
    tags: '',
    start: '',
    end: '',
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
        : ''
      );
    setState({
      task: '',
      assignee: '',
      tags: '',
      start: '',
      end: '',
      status: '',
      [column]: filter
    });
  };

  {/*TODO Add in actual asc and dec filtering */}

  return (
    <div className="Checklist">
      <div className="checklist-header">
        <div
          className={`column ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('task')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Task
          </span>
          {renderArrows('task')}
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
          onClick={() => updateFilterState('start')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Start Date
          </span>
          {renderArrows('start')}
        </div>
        <div
          className={`column ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('end')}
        > {/*TODO hide with props when filtered out */}
        <span>
            End Date
          </span>
          {renderArrows('end')}
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
      {tasks.map((e, i) => <Task task={e} index={i} key={e.id} />)}
    </div>
  );
};

export default Checklist;
