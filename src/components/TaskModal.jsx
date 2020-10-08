import React from 'react';

import DatePicker from "react-datepicker";

const TaskModal = ({isOpen, setIsOpen}) => {

  const closeModal = (isComplete) => {
    /*TODO Add in save task functionality */
    if (isComplete) {
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } else {
      setIsOpen(false);
    }
  }

  return (
    <div className={`Task-modal ${isOpen ? 'show' : ''}`} >
      <div className="modal-container">
        <div className="absolute check">
          <i className="far fa-check-circle" title="Complete Task" onClick={() => closeModal(true)}></i> {/* TODO Add task complete text */}
        </div>
        <div className="absolute exit">
          <i className="fas fa-times" title="Exit" onClick={() => closeModal(false)}></i>
        </div>
        <div className="absolute delete">
          <i className="fas fa-trash-alt" title="Delete Task" ></i> {/* TODO Add Delete functionality */}
        </div>
        <div className="absolute icons">
          Icons {/* TODO Add in bottom right icons after meeting */}
        </div>
        <div className="modal-content">
          <div className="status-box">
            <div className="status-holder">
              <span>Status</span>
              <select
                id="task"
                name="task"
                onChange={status => console.log(status)}
                value={"complete"}
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
                selected={new Date()}
                onChange={date => console.log(date)}
                className="pickers"
              />
            </div>
            <div className="status-holder">
              <span>Complete by</span>
              <DatePicker
                selected={new Date()}
                onChange={date => console.log(date)}
                className="pickers"
              />
            </div>
        </div>
        <div className="task-name">
          TASK NAME
        </div>
        <div className="advice">
          <span className="title">
            Advice from The Independent Bride
          </span>
          <span className="the-advice">
            This will help set the overall tone and feel for the day and will help guide your venue search. 
            You don't have to be overly specific. It can be a cloudy vision, but get an idea of what you're 
            both thinking. For example, if you want a black tie wedding and your fiance wants a picnic those 
            are pretty extreme opposites, so you want to spend some time discussing and coming to agreement. 				
          </span>
        </div>
        <div className="notes">
          <span className="title">
            Notes
          </span>
          <textarea rows="5" />
        </div>
      </div>
    </div>
  </div>
  )
}

export default TaskModal;