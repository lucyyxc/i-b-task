import React from 'react';
import moment from 'moment';

const Task = ({task, index}) => {
  let id, taskName, taskLabel, assignee, tags, startDate, endDate, status;
  
  if (task) {
    ({ id, taskName, taskLabel, assignee, tags, startDate, endDate, status } = task);
  }

  const renderStatusLabel = () => {
    return status === "in-progress"
      ? 'In Progress' 
      : (status === 'complete'
        ? 'Complete'
        : 'Not Stared'
      )
  };

  return (
    <div className={`Task ${index & 1 ? '' : 'gray'}`}>
      <div className="task-name column">
        {taskLabel}
        {/* Add in more details button and modal */}
      </div>
      <div className="assignee column">
        {assignee}
      </div>
      <div className="tags column">
        {tags}
      </div>
      <div className="start column">
        {moment(startDate, 'YYYY-MM-DD').format('MM/DD/YY')}
      </div>
      <div className="end column">
        {moment(endDate, 'YYYY-MM-DD').format('MM/DD/YY')}
      </div>
      <div className="status column">
        {renderStatusLabel()}
      </div>
    </div>
  );
};

export default Task;
