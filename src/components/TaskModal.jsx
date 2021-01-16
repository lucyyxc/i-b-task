import React from 'react';

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import moment from 'moment';
import axios from 'axios';
import DatePicker from "react-datepicker";

import logoBlack from '../styles/assets/logoBlack.png';

const TaskModal = ({isOpen, setIsOpen, modalTask = {}, changeModalTask = () => {}, selected, getUserTasks, tasksLength}) => {
  const [state, setState] = React.useState({
    task: {},
    newTask: true,
    changes: {
      status: '',
      startdate: '',
      enddate: '',
      notes: '',
      archive: false,
      tasklabel: '',
      assignee: ''
    },
    showTip: false
  })

  const defaultChanges = {
    status: '',
    startdate: '',
    enddate: '',
    notes: '',
    archive: false,
    tasklabel: '', 
    assignee: ''
  }
  
  if (_isEmpty(state.task) && !_isEmpty(modalTask)) {
    setState({
      ...state,
      task: modalTask,
      newTask: false
    });
  }

  if (!isOpen && !_isEmpty(state.task)) {
    setState({
      ...state,
      task:{},
      changes: defaultChanges,
      newTask: true,
      showTip: false
    });
  }

  const closeModal = (save) => {
    if (save && !state.newTask) {
      const updates = [];
      if (state.changes.status) updates.push(axios.post('/api/post/statusUpdate', {id: state.task.id, status: state.changes.status}));
      if (state.changes.startdate) updates.push(axios.post('/api/post/startDateUpdate', {id: state.task.id, startdate: state.changes.startdate}));
      if (state.changes.enddate) updates.push(axios.post('/api/post/endDateUpdate', {id: state.task.id, enddate: state.changes.enddate}));
      if (state.changes.notes) updates.push(axios.post('/api/post/notesUpdate', {id: state.task.id, notes: state.changes.notes}));
      if (state.changes.assignee) updates.push(axios.post('/api/post/assigneeUpdate', {id: state.task.id, assignee: state.changes.assignee}));
      if (state.changes.archive) updates.push(axios.post('/api/post/archiveTask', {id: state.task.id}));
      if (state.changes.tasklabel) updates.push(axios.post('/api/post/nameUpdate', {id: state.task.id, tasklabel: state.changes.tasklabel}));

      if (updates.length){
        axios.all(updates)
        .then(responses => {
          console.log(responses);
          setState({
            ...state,
            task: {},
            changes: defaultChanges,
            newTask: true,
            showTip: false
          })
          setIsOpen(false);
          getUserTasks();
        })
        .catch(err => console.log(err))
      }
    } else if ( save && state.newTask && (
      state.changes.status
      || state.changes.startdate
      || state.changes.enddate
      || state.changes.tasklabel
      )
    ){
      const newTaskBody = {
        status: state.changes.status || 'not-started',
        startdate: state.changes.startdate || moment(new Date()).format('YYYY-MM-DD'),
        enddate: state.changes.enddate || moment(new Date()).format('YYYY-MM-DD'),
        notes: state.changes.notes,
        tasklabel: state.changes.tasklabel || 'Unnamed Task',
        id: tasksLength + 25,
        assignee: state.changes.assignee
      }

      axios.post('/api/post/createTask', newTaskBody)
      .then( response => {
        console.log(response);
        setState({
          ...state,
          task: {},
          changes: defaultChanges,
          newTask: true,
          showTip: false
        })
        setIsOpen(false);
        getUserTasks();
      })
      .catch(err => console.log(err));
    } else {
      setState({
        ...state,
        task: {},
        changes: defaultChanges,
        newTask: true,
        showTip: false
      })
      setIsOpen(false);
    }
  }

  console.log(state);
  
  return (
    <div className={`Task-modal ${isOpen ? 'show' : ''}`} >
      <div className="modal-container">
        {_isEmpty(modalTask)
          ? null
          : <>
              <div className="absolute check">
                <i className="far fa-check-circle" 
                  title="Complete Task" 
                  onClick={() => {
                    setState({
                      ...state,
                      task: {
                        ...state.task,
                        status: 'complete'
                      },
                      changes: {
                        ...state.changes,
                        status: 'complete'
                      }
                    })
                    closeModal(true)
                  }}
                ></i>
              </div>
              <div className="absolute delete"  title="Delete" onClick={() => {
                setState({
                  ...state,
                  changes: {
                    ...state.changes,
                    archive: true
                  }
                })
                closeModal(true)
              }}>
                <i className="fas fa-trash-alt" title="Archive Task" ></i>
              </div>
              <div className="absolute icons">
                {state.task.blog && state.task.blogurl
                  ? <div className="blog">
                      <a href={state.task.blogurl} target="_blank" rel="noopener noreferrer">
                        <img className="logo" src={logoBlack} alt="logo" title={state.task.blog} />
                      </a>
                    </div>
                  : null
                }
                {state.task.moneytip
                  ? <div className="money">
                      <i class="fas fa-money-bill-wave" onClick={() => {
                        setState({
                          ...state,
                          showTip: !state.showtip
                        })
                      }}></i>
                      <div className={`tip ${state.showTip ? '' : 'hide'}`}>
                        <div className="neg-tip">Negotiation Tip</div>
                        <div>{state.task.moneytip}</div>
                        <div className="back" onClick={() => {
                          setState({
                            ...state,
                            showTip: false
                          })
                        }}>Back</div>
                      </div>
                    </div>
                  : null
                }
                {state.task.pintrest
                  ? <div className="pintrest">
                      <a href={state.task.pintrest} target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-pinterest"></i>
                      </a>
                    </div>
                  : null
                }
                {state.task.imagename && state.task.imageurl
                  ? <div className="image"></div>
                  : null
                }
              </div>
            </>
          }
        <div className="absolute exit">
          <i className="fas fa-times" title="Exit" onClick={() => closeModal(false)}></i>
        </div>
        {_isEmpty(modalTask) || selected === 'calendar' || state.newTask
          ? null
          : <>
              <div 
                className="absolute arrow next" 
                onClick={() => {
                  setState({
                    ...state,
                    task: {},
                    changes: defaultChanges
                  })
                  changeModalTask('next')
                }}>
                <i className="fas fa-chevron-right"></i>
              </div>
              <div 
                className="absolute arrow previous"
                onClick={() => {
                  setState({
                    ...state,
                    task: {},
                    changes: defaultChanges
                  })
                  changeModalTask('previous')
                }}>
                <i className="fas fa-chevron-left"></i>
              </div>
                  </>
        }
        <div className="modal-content">
          <div className="status-box">
            <div className="status-holder">
              <span>Status</span>
              <select
                id="task"
                name="task"
                onChange={e => {
                  setState({
                    ...state,
                    task: {
                      ...state.task,
                      status: e.target.value
                    },
                    changes: {
                      ...state.changes,
                      status: e.target.value
                    }
                  })
                }}
                value={state.task.status}
                className="task-status"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div className="status-holder">
              <span>Assignee</span>
              <input 
                type="text"
                placeholder="Enter an assignee"
                value={state.task.assignee || ''}
                maxlength="3"
                className="task-assignee"
                onChange={(e) => {
                  setState({
                    ...state,
                    task: {
                      ...state.task,
                      assignee: e.target.value
                    },
                    changes: {
                      ...state.changes,
                      assignee: e.target.value
                    }
                  })
                }}
              />
            </div>
            <div className="status-holder">
              <span>Start on</span>
              <DatePicker
                selected={moment(state.task.startdate).toDate() || new Date()}
                onChange={date => {
                  setState({
                    ...state,
                    task: {
                      ...state.task,
                      startdate: moment(date).format('YYYY-MM-DD')
                    },
                    changes: {
                      ...state.changes,
                      startdate: moment(date).format('YYYY-MM-DD')
                    }
                  })
                }}
                className="pickers"
              />
            </div>
            <div className="status-holder">
              <span>Complete by</span>
              <DatePicker
                selected={moment(state.task.enddate).toDate() || new Date()}
                onChange={date => {
                  setState({
                    ...state,
                    task: {
                      ...state.task,
                      enddate: moment(date).format('YYYY-MM-DD')
                    },
                    changes: {
                      ...state.changes,
                      enddate: moment(date).format('YYYY-MM-DD')
                    }
                  })
                }}
                className="pickers"
              />
            </div>

        </div>
        <input
          className="task-name"
          type="text"
          value={state.task.tasklabel || ''}
          placeholder="Please enter a task name."
          onChange={(e) => {
            setState({
              ...state,
              task: {
                ...state.task,
                tasklabel: e.target.value
              },
              changes: {
                ...state.changes,
                tasklabel: e.target.value
              }
            })
          }}
        />
        <div className="advice">
          <span className="title">
            Advice from The Independent Bride
          </span>
          <span className="the-advice">
            {_get(state.task, 'advice', 'Your task, your rules!')}			
          </span>
        </div>
        <div className="notes">
          <span className="title">
            Notes
          </span>
          <textarea 
            rows="5"
            value={_get(state.task, 'notes', '')}
            placeholder="Jot down some notes..."
            onChange={(e) => {
              setState({
                ...state,
                task: {
                  ...state.task,
                  notes: e.target.value
                },
                changes: {
                  ...state.changes,
                  notes: e.target.value
                }
              })
            }}
          />
        </div>
        <div className="save-button-holder">
          <div className="save-button" onClick={() => closeModal(true)}>
            <span>SAVE</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TaskModal;