import React from 'react';

const Views = ({selected = 'checklist'}) => (
  <div className={`Views ${selected}`}>
    <button className="button" id="checklist">Checklist</button>
    <button className="button" id="calendar">Calendar</button>
    <button className="button" id="progress">Progress</button>
    <button className="button" id="files">Files</button>
  </div>
);

export default Views;
