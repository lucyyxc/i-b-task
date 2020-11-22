import React from 'react';

const Views = ({selected}) => {
  return (
  <div className={`Views ${selected}`}>
    <a
      className="button"
      id="checklist"
      href="/#/checklist"
    >
      Checklist
    </a>
    <a
      className="button"
      id="calendar"
      href="/#/calendar"
    >
      Calendar
    </a>
    <a
      className="button"
      id="progress"
      href="/#/progress"
      >
        Progress
      </a>
    <a
      className="button"
      id="files"
      href="/#/files"
    >
      Files
    </a>
  </div>
)
  }

export default Views;
