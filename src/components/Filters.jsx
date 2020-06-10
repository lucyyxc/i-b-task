import React from 'react';

const Filters = () => (
  <div className="Filters">
    <select id="task" name="task">
      <option value="" disabled selected hidden>Filter by Task</option>
      <option value="incomplete">Incomplete</option>
      <option value="complete">Complete</option>
      <option value="all">All Tasks</option>
    </select>
    <select id="date" name="date">
    <option value="" disabled selected hidden>Filter by Date</option>
      <option value="all">All</option>
      <option value="this-week">Due This Week</option>
      <option value="next-week">Due Next Week</option>
      <option value="custom">Custom Dates</option>
    </select>
  </div>
);

export default Filters;
