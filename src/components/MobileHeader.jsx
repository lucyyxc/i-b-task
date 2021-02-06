import React from "react";

import TaskModal from './TaskModal';
import ProfileMenu from './ProfileMenu';

const MobileHeader = ({getUserTasks, tasksLength, taskFilter, updateStateValue, user, selected}) => {
    const [state, setState] = React.useState({
        isTaskOpen: false,
        isFiltersOpen: false,
        isViewsOpen: false,
        modalTask: {},
        show: 'hidden'
    })

  const toggleMenu = () => {
    if (state.show) {
        setState({
            ...state,
            isTaskOpen: false,
            isFiltersOpen: false,
            isViewsOpen: false,
            show: ''
        })
    } else {
        setState({
            ...state,
            isTaskOpen: false,
            isFiltersOpen: false,
            isViewsOpen: false,
            show: 'hidden'
        })
    }
  }

    const openTaskModal = () => {
        setState({
          ...state,
          modalTask: {},
          isTaskOpen: true,
          isFiltersOpen: false,
          isViewsOpen: false,
          show: 'hidden'
        })
    };

    const openFiltersDropdown = () => {
        setState({
            ...state,
            modalTask: {},
            isTaskOpen: false,
            isFiltersOpen: !state.isFiltersOpen,
            isViewsOpen: false,
            show: 'hidden'
        })
    }

    const openViewsDropdown = () => {
        setState({
            ...state,
            modalTask: {},
            isTaskOpen: false,
            isFiltersOpen: false,
            isViewsOpen: !state.isViewsOpen,
            show: 'hidden'
        })
    }


  return (
    <>
        <div className="MobileHeader">
            <i className="fas fa-plus icon" onClick={() => openTaskModal()}></i>
            <i className="fas fa-sliders-h icon" onClick={() => openFiltersDropdown()}>
                <div className={`filters-holder ${state.isFiltersOpen ? '' : 'hide'}`}>
                    <span
                        className={`filter ${taskFilter === 'incomplete' ? 'selected' : ''}`}
                        onClick={() => updateStateValue('taskFilter', 'incomplete')}
                    >Incomplete</span>
                    <span
                        className={`filter ${taskFilter === 'complete' ? 'selected' : ''}`}
                        onClick={() => updateStateValue('taskFilter', 'complete')}
                    >Complete</span>
                    <span
                        className={`filter ${taskFilter === 'archived' ? 'selected' : ''}`}
                        onClick={() => updateStateValue('taskFilter', 'archived')}
                    >Archived</span>
                    <span
                        className={`filter ${taskFilter === 'all' ? 'selected' : ''}`}
                        onClick={() => updateStateValue('taskFilter', 'all')}
                    >All Tasks</span>
                </div>
            </i>
            <i className="fas fa-ellipsis-v icon" onClick={() => openViewsDropdown()}>
                <div className={`views-holder ${state.isViewsOpen ? '' : 'hide'}`}>
                    <a
                        className={`${selected === 'checklist' ? 'selected' : ''}`}
                        id="checklist"
                        href="/#/checklist"
                    >
                        Checklist
                    </a>
                    <a
                        className={`${selected === 'calendar' ? 'selected' : ''}`}
                        id="calendar"
                        href="/#/calendar"
                    >
                        Calendar
                    </a>
                    <a
                        className={`${selected === 'progress' ? 'selected' : ''}`}
                        id="progress"
                        href="/#/progress"
                    >
                        Progress
                    </a>
                </div>
            </i>
            <i className="far fa-user-circle icon" onClick={() => toggleMenu()}>
                <ProfileMenu show={state.show} user={user} toggleMenu={toggleMenu} />
            </i>
        </div>
        <div className={`${state.isTaskOpen ? 'overlay' : ''}`} onClick={() => setState({...state, isTaskOpen: false, modalTask: {}})}></div>
        <TaskModal
            isOpen={state.isTaskOpen}
            setIsOpen={(bool) => setState({...state, isTaskOpen: bool, modalTask: {}})}
            modalTask={state.modalTask}
            getUserTasks={getUserTasks}
            tasksLength={tasksLength}
            isNewTask={true}
        />
    </>
  );
};

export default MobileHeader;