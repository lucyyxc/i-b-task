import React from 'react';

const Views = ({selected = 'checklist', updateView}) => (
  <div className={`Views ${selected}`}>
    <button
      className="button"
      id="checklist"
      onClick={() => updateView('checklist')}
    >
      Checklist
    </button>
    <button
      className="button"
      id="calendar"
      onClick={() => updateView('calendar')}
    >
      Calendar
    </button>
    <button
      className="button"
      id="progress"
      onClick={() => updateView('progress')}
      >
        Progress
      </button>
    <button
      className="button"
      id="files"
      onClick={() => updateView('files')}
    >
      Files
    </button>
  </div>
);

export default Views;
