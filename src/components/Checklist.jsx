import React from 'react';
import _forIn from 'lodash/forIn'

import Task from './Task';
import TaskModal from './TaskModal';

const Checklist = ({tasks, taskFilter}) => {
  const [state, setState] = React.useState({
    taskLabel: '',
    assignee: '',
    tags: '',
    startDate: '',
    endDate: '',
    status: '',
    isOpen: false,
    modalTask: {},
    modalTaskIndex: 0,
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
      ...state,
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

  const taskFilterFunc = (value, key) => {
    filteredTasks = filteredTasks.sort((a, b) => {
      if (value === "DEC") {
        return (a[key] > b[key] ? -1 : (a[key] < b[key] ? 1 : 0))
      } else {
        return (a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0))
      }
    });
  };

  if (tasks){
     _forIn(state, (value, key) => {
      if (value != false) {
        taskFilterFunc(value, key)
      }
    });
    if (taskFilter === 'complete') {
      filteredTasks = filteredTasks.filter( task => task.status === 'complete');
    }

    if (taskFilter === 'incomplete') {
      filteredTasks = filteredTasks.filter( task => task.status !== 'complete');
    }
  }

  const openModal = (id) => {
    const newIndex = tasks.findIndex((task) => {
      if (task.id === id) {
        return task;
      }
    });

    setState({
      ...state,
      modalTaskIndex: newIndex,
      modalTask: tasks[newIndex],
      isOpen: true,
    })
  };

  const changeModalTask = (direction) => {
    let newIndex;

    if (direction === 'next') {
      newIndex = state.modalTaskIndex + 1 > tasks.length - 1 ? 0 : state.modalTaskIndex + 1;
    } else {
      newIndex = state.modalTaskIndex === 0 ? tasks.length - 1 : state.modalTaskIndex - 1;
    }

    setState({
      ...state, 
      modalTaskIndex: newIndex,
      modalTask: tasks[newIndex],
    })
  };

  return (
    <div className="Checklist">
      <div className={`${state.isOpen ? 'overlay' : ''}`} onClick={() => setState({...state, isOpen: false})}>
      </div>
      <TaskModal isOpen={state.isOpen} setIsOpen={(bool) => setState({...state, isOpen: bool})} modalTask={state.modalTask} changeModalTask={changeModalTask}/>
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
      {filteredTasks.map((e, i) => <Task task={e} index={i} key={e.id} openModal={openModal} />)}
    </div>
  );
};

export default Checklist;
