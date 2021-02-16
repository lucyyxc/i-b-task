import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list';
import moment from 'moment';

import TaskModal from './TaskModal';

const Calendar = ({tasks, selected, getUserTasks}) => {
  const [state, setState] = React.useState({
    calTasks: tasks,
    isOpen: false,
    modalTask: {}
  })

  React.useEffect(() => {
    const filteredTasks = tasks.filter( task => !task.archived)
    setState({
      ...state,
      calTasks: filteredTasks
    })
  }, [tasks]);

  const createCalEvents = () => {
    return state.calTasks.map(task => {
      let backgroundColor = '';
      let textColor = '#FFFFFF';

      switch (true) {
        case moment().format("YYYY-MM-DD") === task.startdate: // Starts today
          backgroundColor = '#70825a';
          break;
        case moment().add(1, 'd').format("YYYY-MM-DD") === task.enddate: // Ends tomorrow (last day to work on it is today)
          backgroundColor = '#EFC30A';
          break;
        case task.status === 'in-progress': // in-progress
          backgroundColor = '#F6DDC8';
          break;
        case task.status === 'complete': // complete
          backgroundColor = ' #70825A';
          break;
        default:
          backgroundColor = '#fc6959'
          break
      }
    
      return { 
        title: task.tasklabel,
        id: task.id,
        start: task.startdate,
        end: task.enddate,
        backgroundColor,
        borderColor: backgroundColor,
        textColor
      }
    });
  }

  const handleClick = ({event}) => {
    const modalTask = tasks.find(task => +task.id === +event.id)
    setState({
      ...state,
      isOpen: true,
      modalTask
    })
  }

  const Item = ({text, color}) => (
    <div className="item">
      <div className={`color ${color}`}></div>
      <div className="legend-label">{text}</div>
    </div>
  );
  
  return (
    <div className="Calendar">
      <FullCalendar
        plugins={[ dayGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth dayGridWeek listMonth'
        }}
        fixedWeekCount={false}
        events={createCalEvents()}
        eventClick={handleClick}
      />
      <div className="legend">
        <Item text={'Tasks to Start Today'} color={'start'} />
        <Item text={'Tasks Due Today'} color={'end'} />
        <Item text={'Tasks In Progress'} color={'in-progress'} />
      </div>
      <div className={`${state.isOpen ? 'overlay' : ''}`} onClick={() => setState({...state, isOpen: false, modalTask: {}})}></div>
      <TaskModal
        isOpen={state.isOpen}
        setIsOpen={(bool) => setState({...state, isOpen: bool, modalTask: {}})}
        modalTask={state.modalTask}
        selected={selected}
        getUserTasks={getUserTasks}
      />
    </div>
  );
}

export default Calendar;
