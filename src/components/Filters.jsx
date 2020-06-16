import React from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Filters = ({
  updateDateFilter,
  dateFilter,
  taskFilter,
  dateStart,
  dateEnd,
  updateStateValue
}) => (
  <div className="Filters">
    {dateFilter === 'custom'
      ? <>
        <DatePicker
          selected={dateStart}
          onChange={date => updateStateValue('dateStart', date)}
          selectsStart
          startDate={dateStart}
          endDate={dateEnd}
          className="pickers"
        />
        <DatePicker
          selected={dateEnd}
          onChange={date => updateStateValue('dateEnd', date)}
          selectsEnd
          startDate={dateStart}
          endDate={dateEnd}
          minDate={dateStart}
          className="pickers"
        />
      </>
      : null
    }
    <select
      id="date"
      name="date"
      onChange={e => updateDateFilter(e.target.value)}
      value={dateFilter}
    >
      <option value="" disabled selected hidden>Filter by Date</option>
      <option value="all">All</option>
      <option value="this-week">Due This Week</option>
      <option value="next-week">Due Next Week</option>
      <option value="custom">Custom Dates</option>
    </select>
    <select
      id="task"
      name="task"
      onChange={e => updateStateValue('taskFilter', e.target.value)}
      value={taskFilter}
    >
      <option value="" disabled selected hidden>Filter by Task</option>
      <option value="incomplete">Incomplete</option>
      <option value="complete">Complete</option>
      <option value="all">All Tasks</option>
    </select>
  </div>
);

export default Filters;
