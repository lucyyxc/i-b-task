import React from 'react';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import moment from 'moment';
import axios from 'axios';
import DatePicker from "react-datepicker";

import pinkLogo from '../styles/assets/pinkLogo.png';

const TaskModal = ({isOpen, setIsOpen, modalTask = {}, changeModalTask = () => {}, selected, getUserTasks, tasksLength, handleDateChangeRaw}) => {
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
      assignee: '',
      tags: ''
    },
    showTip: false,
    confirmArchive: false,
  })

  const defaultChanges = {
    status: '',
    startdate: '',
    enddate: '',
    notes: '',
    archive: false,
    tasklabel: '', 
    assignee: '',
    tags: ''
  }

  React.useEffect(() => {
    if (state.changes.archive) {
      closeModal(true);
    }
  }, [state.confirmArchive])
  
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
      if (state.changes.tags) updates.push(axios.post('/api/post/tagUpdate', {id: state.task.id, tags: state.changes.tags}));
      if (state.changes.archive) updates.push(axios.post('/api/post/archiveTask', {id: state.task.id}));
      if (state.changes.tasklabel) updates.push(axios.post('/api/post/nameUpdate', {id: state.task.id, tasklabel: state.changes.tasklabel}));

      if (updates.length){
        axios.all(updates)
        .then(responses => {
          setState({
            ...state,
            task: {},
            changes: defaultChanges,
            newTask: true,
            showTip: false,
            confirmArchive: false
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
        assignee: state.changes.assignee,
        tags: state.changes.tags
      }

      axios.post('/api/post/createTask', newTaskBody)
      .then( response => {
        setState({
          ...state,
          task: {},
          changes: defaultChanges,
          newTask: true,
          showTip: false,
          confirmArchive: false
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
        showTip: false,
        confirmArchive: false
      })
      setIsOpen(false);
    }
  }

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
              <div className="absolute delete">
                <div className={`confirm ${state.confirmArchive ? '' : 'hide'}`}>
                  <div className="confirm-text">Are you sure you want to archive this task?</div>
                  <div className="button-holder">
                    <div className="button cancel" onClick={() => {
                      setState({
                        ...state,
                        confirmArchive: false
                      })
                    }}>Cancel</div>
                    <div className="button yes" onClick={() => {
                      setState({
                        ...state,
                        confirmArchive: false,
                        changes: {
                          ...state.changes,
                          archive: true,
                        }
                      })
                    }}>Archive</div>
                  </div>
                </div>
                <i className="fas fa-trash-alt" title="Archive"  onClick={() => {
                  setState({
                    ...state,
                    confirmArchive: true
                  })
                }}
                ></i>
              </div>
              <div className="absolute icons">
                {state.task.blogurl
                  ? <div className="blog">
                      <a href={state.task.blogurl} target="_blank" rel="noopener noreferrer">
                        <img className="logo" src={pinkLogo} alt="logo" title="Blog Post" />
                      </a>
                    </div>
                  : null
                }
                {state.task.moneytip
                  ? <div className="money">
                      <i class="fas fa-comment-dollar" title="Negotiation Tip" onClick={() => {
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
                        <i class="fab fa-pinterest" title="Pintrest Board" ></i>
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
          <i className="fas fa-times" title="Close" onClick={() => closeModal(false)}></i>
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
                maxlength="2"
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
              <span>Tag</span>
              <input 
                type="text"
                placeholder="Enter a tag"
                value={state.task.tags || ''}
                className="task-tag"
                onChange={(e) => {
                  setState({
                    ...state,
                    task: {
                      ...state.task,
                      tags: e.target.value
                    },
                    changes: {
                      ...state.changes,
                      tags: e.target.value
                    }
                  })
                }}
              />
            </div>
            <div className="status-holder">
              <span>Start on</span>
              <DatePicker
                selected={moment(state.task.startdate).toDate() || new Date()}
                onChangeRaw={handleDateChangeRaw}
                onChange={date => {
                  if(moment(state.task.enddate).isBefore(moment(date))) {
                    toast.error('You cannot select a Complete by date that is before the Start on date.', {
                      position: "top-center",
                      autoClose: 4000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      transition: Slide
                    });
                  } else {
                    setState({
                      ...state,
                      task: {
                        ...state.task,
                        startdate: moment(date).format('YYYY-MM-DD')
                      },
                      changes: {
                        ...state.changes,
                        startdate: moment(date).format('YYYY-MM-DD')
                      },
                    })
                  }
                }}
                className="pickers"
              />
            </div>
            <div className="status-holder">
              <span>Complete by</span>
              <DatePicker
                selected={moment(state.task.enddate).toDate() || new Date()}
                onChangeRaw={handleDateChangeRaw}
                onChange={date => {
                  if (moment(date).isBefore(state.task.startdate)) {
                    toast.error('You cannot select a Complete by date that is before the Start on date.', {
                      position: "top-center",
                      autoClose: 4000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      transition: Slide,
                    });
                  } else {
                    setState({
                      ...state,
                      task: {
                        ...state.task,
                        enddate: moment(date).format('YYYY-MM-DD')
                      },
                      changes: {
                        ...state.changes,
                        enddate: moment(date).format('YYYY-MM-DD')
                      },
                    })
                  }
                }}
                className="pickers"
              />
            </div>
        </div>
        <input
          className="task-name"
          type="text"
          maxlength="41"
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
            {_get(state.task, 'advice', 'Your task your rules! Add any notes or links to the section below.')}			
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