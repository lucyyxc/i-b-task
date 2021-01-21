import React from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment';

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
          startdate={dateStart}
          enddate={dateEnd}
          className="pickers"
        />
        <DatePicker
          selected={dateEnd}
          onChange={date => updateStateValue('dateEnd', date)}
          selectsEnd
          startdate={dateStart}
          enddate={dateEnd}
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
    > {/*TODO make these filters actually filter */}
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
      <option value="incomplete" selected >Incomplete</option>
      <option value="complete">Complete</option>
      <option value="archived">Archived</option>
      <option value="all">All Tasks</option>
    </select>
  </div>
);

export default Filters;
