import React from 'react';

const Views = ({selected = 'checklist', updateStateValue}) => (
  <div className={`Views ${selected}`}>
    <button
      className="button"
      id="checklist"
      onClick={() => updateStateValue('selected', 'checklist')}
    >
      Checklist
    </button>
    <button
      className="button"
      id="calendar"
      onClick={() => updateStateValue('selected', 'calendar')}
    >
      Calendar
    </button>
    <button
      className="button"
      id="progress"
      onClick={() => updateStateValue('selected', 'progress')}
      >
        Progress
      </button>
    <button
      className="button"
      id="files"
      onClick={() => updateStateValue('selected', 'progress')}
    >
      Files
    </button>
  </div>
);

export default Views;
