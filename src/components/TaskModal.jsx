import React from 'react';

const TaskModal = ({isOpen}) => {

  return (
    <div className={`Task-modal ${isOpen ? 'show' : ''}`} >
      <div className="status-box">
        <div className="status-labels">
          <span className="label">Status</span>
          <span className="label">Start on</span>
          <span className="label">Complete by</span>
        </div>
        <div className="status-values">
          <input className='value'></input>
          <input className='value'></input>
          <input className='value'></input>
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
          
        </span>
      </div>
      <div className="notes">
        <span className="title">
          Notes
        </span>
        <textarea>

        </textarea>
      </div>
    </div>
  )
}

export default TaskModal;