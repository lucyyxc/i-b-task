import React from 'react';

import DatePicker from "react-datepicker";

const TaskModal = ({isOpen}) => {

  return (
    <div className={`Task-modal ${isOpen ? 'show' : ''}`} >
      <div className="modal-container">
        <div className="absolute check">
          Check
        </div>
        <div className="absolute exit">
          Exit
        </div>
        <div className="absolute delete">
          Delete
        </div>
        <div className="absolute icons">
          Icons
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