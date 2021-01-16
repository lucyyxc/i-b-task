import React from 'react';
import _forIn from 'lodash/forIn'

import Task from './Task';
import TaskModal from './TaskModal';

const Checklist = ({tasks = [], taskFilter, search, selected, getUserTasks}) => {
  const [state, setState] = React.useState({
    tasklabel: '',
    assignee: '',
    tags: '',
    startdate: '',
    enddate: '',
    status: '',
    isOpen: false,
    modalTask: {},
    modalTaskIndex: 0
  });

  if (!tasks.length) return null;
  
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
      tasklabel: '',
      assignee: '',
      tags: '',
      startdate: '',
      enddate: '',
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

    if (search.length > 3) {
      filteredTasks = filteredTasks.filter( task => task.tasklabel.toLowerCase().includes(search.toLowerCase()))
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
      <div className={`${state.isOpen ? 'overlay' : ''}`} onClick={() => setState({...state, isOpen: false, modalTask: {}})}></div>
      <TaskModal
        isOpen={state.isOpen}
        setIsOpen={(bool) => setState({...state, isOpen: bool, modalTask: {}})}
        modalTask={state.modalTask}
        changeModalTask={changeModalTask}
        selected={selected}
        getUserTasks={getUserTasks}
        tasksLength={filteredTasks.length}
        isNewTask={state.isNewTask}
      />
      <div className="new-task" onClick={() => openModal()}>
        <i class="fas fa-plus"></i>
        <span className="new-task-label">Add Task</span>
      </div>
      <div className="checklist-header">
        <div className="spacer"></div>
        <div
          className={`column header task-label ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('tasklabel')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Task
          </span>
          {renderArrows('tasklabel')}
        </div>
        <div
          className={`column header ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('assignee')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Assignee
          </span>
          {renderArrows('assignee')}
        </div>
        <div
          className={`column header ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('tags')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Tags
          </span>
          {renderArrows('tags')}
        </div>
        <div
          className={`column header ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('startdate')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Start Date
          </span>
          {renderArrows('startdate')}
        </div>
        <div
          className={`column header ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('enddate')}
        > {/*TODO hide with props when filtered out */}
        <span>
            End Date
          </span>
          {renderArrows('enddate')}
        </div>
        <div
          className={`column header ${true ? '' : 'hide'}`}
          onClick={() => updateFilterState('status')}
        > {/*TODO hide with props when filtered out */}
          <span>
            Status
          </span>
          {renderArrows('status')}
        </div>
      </div>
      <hr />
      {filteredTasks.map((e, i) => <Task task={e} index={i} key={e.id} openModal={openModal} getUserTasks={getUserTasks} />)}
    </div>
  );
};

export default Checklist;
