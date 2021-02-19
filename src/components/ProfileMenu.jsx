import React from 'react';
// import { useAuth0 } from "@auth0/auth0-react";

import Profile from './Profile';

import { Redirect } from 'react-router-dom';

const LogOutModal = ({modal, cancel}) => (
  <div className={`modal logout-confirm ${modal ? 'show': ''}`} onClick={e => e.stopPropagation()}>
    <span className="message">Are you sure?</span>
    <div className="button-holder">
      <a className="button logout-link" href="/auth/logout"><p>Log Out</p></a>
      <div className="button" onClick={() => cancel()}><p>Cancel</p></div>
    </div>
  </div>
);

const ProfileMenu = ({show, user, toggleMenu, getUserTasks, getUserInfo, handleDateChangeRaw}) => {
  const [state, setState] = React.useState({
    modal: false,
    display: 'logout',
    redirect: false
  })

  const logOut = () => {
    setState({
      ...state,
      modal: false,
      display: '',
      redirect: true
    })
    toggleMenu()
  };

  const cancel = () => {
    setState({
      ...state,
      modal: false,
      display: ''
    })
    toggleMenu()
  };

  if(show === 'hidden' && state.modal) {
    getUserInfo()
    setState({
      ...state,
      modal: false
    })
  };

  if (state.redirect) {
    return <Redirect to="/auth/logout" />
  }
  
  return (
    <div className={`ProfileMenu ${show}`}>
      <div className="name link">
        {`${user.name}`}
      </div>
      <div 
        className="link"
        onClick={(e) => {
          e.stopPropagation();
          getUserInfo()
          setState({
            ...state,
            display: 'profile',
            modal: true
          })
        }}
      >
        Manage Profile
      </div>
      <div 
        className="link" 
        onClick={(e) => {
          e.stopPropagation();
          setState({
            ...state,
            display: 'logout',
            modal: true
          })
        }}
      >
        Log Out
      </div>
      <div className="email">
        Having issues? Contact us at <br /><a href="mailto:contact@theindependentbride.com">contact@theindependentbride.com</a>.
      </div>
      {state.display === 'logout'
        ? <LogOutModal {...{modal: state.modal, logOut, cancel}} />
        : <Profile {...{user, modal: state.modal, cancel, getUserTasks, getUserInfo, handleDateChangeRaw}} />
      }
    </div>
  )
};

export default ProfileMenu;
