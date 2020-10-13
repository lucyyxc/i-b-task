import React from 'react';

import _get from 'lodash/get';

import moment from 'moment';

import DatePicker from "react-datepicker";

const TaskModal = ({isOpen, setIsOpen, modalTask = {}, changeModalTask}) => {
  const [task, updateTask] = React.useState({});
  
  if (!task.notes) {
    task.notes = _get(modalTask, 'details.notes');
  }

  const closeModal = (save) => {
    /*TODO Add in save task functionality
      make sure to update custom value on task so we know */
    if (save) {
      setTimeout(() => {
        updateTask({}) //TODO Temp before we get into saveing
        setIsOpen(false);
      }, 1000);
    } else {
      updateTask({})
      setIsOpen(false);
    }
  }

  const deleteTask = () => {
    //TODO delete when db is ready
    closeModal(false)
  }

  return (
    <div className={`Task-modal ${isOpen ? 'show' : ''}`} >
      <div className="modal-container">
        <div className="absolute check">
          <i className="far fa-check-circle" 
            title="Complete Task" 
            onClick={() => {
            updateTask({...task, status: 'complete'})
            closeModal(true)
          }}
        ></i> {/* TODO Add task complete text */}
        </div>
        <div className="absolute exit">
          <i className="fas fa-times" title="Exit" onClick={() => closeModal(false)}></i>
        </div>
        <div className="absolute delete"  title="Delete" onClick={() => deleteTask(modalTask.id, modalTask.userId)}>
          <i className="fas fa-trash-alt" title="Delete Task" ></i> {/* TODO Add Delete functionality */}
        </div>
        <div className="absolute icons">
          Icons {/* TODO Add in bottom right icons*/}
        </div>
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
        <div className="modal-content">
          <div className="status-box">
            <div className="status-holder">
              <span>Status</span>
              <select
                id="task"
                name="task"
                onChange={e => updateTask({...task, status: e.target.value})} //TODO make this change the status in db
                value={modalTask.status}
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
                selected={
                  task.startDate
                    ? moment(task.startDate).toDate()
                    : moment(modalTask.startDate).toDate()
                }
                onChange={date => updateTask({...task, startDate: moment(date).format('YYYY-MM-DD')})}
                className="pickers"
              />
            </div>
            <div className="status-holder">
              <span>Complete by</span>
              <DatePicker
                selected={
                  task.endDate
                    ? moment(task.endDate).toDate()
                    : moment(modalTask.endDate).toDate()
                }
                onChange={date => updateTask({...task, endDate: moment(date).format('YYYY-MM-DD')})}
                className="pickers"
              />
            </div>
        </div>
        <div className="task-name">
          {modalTask.taskLabel}
        </div>
        <div className="advice">
          <span className="title">
            Advice from The Independent Bride
          </span>
          <span className="the-advice">
            {_get(modalTask, 'details.advice', '')}			
          </span>
        </div>
        <div className="notes">
          <span className="title">
            Notes
          </span>
          <textarea 
            rows="5"
            value={task.notes}
            onChange={(e) => updateTask({...task, notes: e.target.value})}
          /> {/*TODO send this to db when done*/}
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