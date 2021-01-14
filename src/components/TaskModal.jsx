import React from 'react';

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import moment from 'moment';
import axios from 'axios';

import DatePicker from "react-datepicker";

const TaskModal = ({isOpen, setIsOpen, modalTask = {}, changeModalTask = () => {}, selected}) => {
  const [state, setState] = React.useState({
    task: {},
    newTask: true,
    changes: {
      status: '',
      startdate: '',
      enddate: '',
      notes: '',
      archive: false,
      name: ''
    }
  })

  const updateTask = (updatedTask, key, change) => {
    if (key && change) {
      setState({
        ...state,
        'task': updatedTask,
        changes: {
          ...state.changes,
          [key]: change
        }
      });
    } else {
      setState({
        ...state,
        'task': updatedTask
      });
    }
  }

  const isNewTask = (bool) => {
    setState({
      ...state,
      'newTask': bool
    });
  }
  
  if (_isEmpty(state.task) && !_isEmpty(modalTask)) {
    updateTask(modalTask);
    isNewTask(false)
  }

  if (!isOpen && !_isEmpty(state.task)) {
    updateTask({})
  }

  const closeModal = (save) => {
    if (save) {
      const updates = [];
      if (state.changes.status) updates.push(axios.post('/api/post/statusUpdate'), {id: state.task.id, status: state.changes.status});
      if (state.changes.startdate) updates.push(axios.post('/api/post/startDateUpdate'), {id: state.task.id, status: state.changes.startdate});
      if (state.changes.enddate) updates.push(axios.post('/api/post/endDateUpdate'), {id: state.task.id, status: state.changes.enddate});
      if (state.changes.notes) updates.push(axios.post('/api/post/notesUpdate'), {id: state.task.id, status: state.changes.notes});
      if (state.changes.archive) updates.push(axios.post('/api/post/archiveTask'), {id: state.task.id});
      if (state.changes.name) updates.push(axios.post('/api/post/nameUpdate'), {id: state.task.id, status: state.changes.name});

      if (updates.length){ //TODO UNTESTED
        axios.all(updates)
        .then(responses => {
          console.log(responses);
          updateTask({})
          setIsOpen(false);
        })
      }
    } else {
      updateTask({})
      setIsOpen(false);
    }
  }

  const deleteTask = () => {
    setState({
      ...state,
      changes: {
        ...state.changes,
        archive: true
      }
    })
    closeModal(true)
  }

  console.log(state);
  
  return (
    <div className={`Task-modal ${isOpen ? 'show' : ''}`} >
      <div className="modal-container">
        {_isEmpty(modalTask)
          ? null
          : <>
              <div className="absolute check">
                <i className="far fa-check-circle" 
                  title="Complete Task" 
                  onClick={() => {
                    updateTask({...state.task, status: 'complete'}, 'status', 'complete')
                    closeModal(true)
                  }}
                ></i> {/* TODO Add task complete text */}
              </div>
              <div className="absolute delete"  title="Delete" onClick={() => deleteTask(modalTask.id, modalTask.userid)}>
                <i className="fas fa-trash-alt" title="Delete Task" ></i>
              </div>
              <div className="absolute icons">
                Icons {/* TODO Add in bottom right icons*/}
              </div>
            </>
        }
        <div className="absolute exit">
          <i className="fas fa-times" title="Exit" onClick={() => closeModal(false)}></i>
        </div>
        {_isEmpty(modalTask) || selected === 'calendar'
          ? null
          : <>
              <div 
                className="absolute arrow next" 
                onClick={() => {
                  updateTask({});
                  changeModalTask('next')
                }}>
                <i className="fas fa-chevron-right"></i>
              </div>
              <div 
                className="absolute arrow previous"
                onClick={() => {
                  updateTask({});
                  changeModalTask('previous')
                }}>
                <i className="fas fa-chevron-left"></i>
              </div>
                  </>
        }
        
        <div className="modal-content">
          <div className="status-box">
            <div className="status-holder">
              <span>Status</span>
              <select
                id="task"
                name="task"
                onChange={e => updateTask({...state.task, status: e.target.value}, 'status', e.target.value)}
                value={state.task.status}
                className="task-status"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div className="status-holder">
              <span>Start on</span>
              <DatePicker
                selected={moment(state.task.startdate).toDate() || new Date()}
                onChange={date => updateTask({...state.task, startdate: moment(date).format('YYYY-MM-DD')}, 'startdate', moment(date).format('YYYY-MM-DD'))}
                className="pickers"
              />
            </div>
            <div className="status-holder">
              <span>Complete by</span>
              <DatePicker
                selected={moment(state.task.enddate).toDate() || new Date()}
                onChange={date => updateTask({...state.task, enddate: moment(date).format('YYYY-MM-DD')}, 'enddate', moment(date).format('YYYY-MM-DD'))}
                className="pickers"
              />
            </div>
        </div>
        <input
          className="task-name"
          type="text"
          value={state.task.tasklabel || ''}
          placeholder="Please enter a task name."
          onChange={(e) => updateTask({...state.task, tasklabel: e.target.value}, 'name', e.target.value)}
        />
        <div className="advice">
          <span className="title">
            Advice from The Independent Bride
          </span>
          <span className="the-advice">
            {_get(state.task, 'advice', 'Your task, your rules!')}			
          </span>
        </div>
        <div className="notes">
          <span className="title">
            Notes
          </span>
          <textarea 
            rows="5"
            value={_get(state.task, 'notes', '')}
            placeholder="Jot down some notes..."
            onChange={(e) => updateTask({...state.task, notes: e.target.value}, 'notes', e.target.value)}
          />
        </div>
        <div className="save-button-holder">
          <div className="save-button" onClick={() => closeModal(true)}>
            <span>SAVE</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TaskModal;