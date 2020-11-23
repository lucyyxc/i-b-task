import React from 'react';
// import { useAuth0 } from "@auth0/auth0-react";

import Profile from './Profile';

import { Redirect } from 'react-router-dom';

const LogOutModal = ({modal, cancel}) => (
  <div className={`modal logout-confirm ${modal ? 'show': ''}`}>
    <span className="message">Are you sure?</span>
    <div className="button-holder">
      <a className="button logout-link" href="/auth/logout"><p>Log Out</p></a>
      <div className="button" onClick={() => cancel()}><p>Cancel</p></div>
    </div>
  </div>
);

const ProfileMenu = ({show, user, toggleMenu}) => {
  const [modal, showModal] = React.useState(false);
  const [display, swapDisplay] = React.useState('');
  const [redirect, setRedirect] = React.useState(false)


  const logOut = () => {
    showModal(false)
    swapDisplay('')
    toggleMenu()
    setRedirect(true)
  };

  const cancel = () => {
    showModal(false)
    swapDisplay('')
    toggleMenu()
  };

  if(show === 'hidden' && modal) showModal(false);

  if (redirect) {
    return <Redirect to="/auth/logout" />
  }

  return (
    <div className={`ProfileMenu ${show}`}>
      <div className="user-info">
        <div className="name">
          {`${user.name}`}
        </div>
        <div 
          className="link"
          onClick={() => {
            swapDisplay('profile')
            showModal(true)
          }}
        >
          Manage Profile
        </div>
      </div>
      <hr />
      <div 
        className="link" 
        onClick={() => {
          swapDisplay('logout')
          showModal(true)
        }}
      >
        Log Out
      </div>
      {display === 'logout'
        ? <LogOutModal {...{modal, logOut, cancel}} />
        : <Profile {...{user, modal, cancel}} />
      }
    </div>
  )
};

export default ProfileMenu;
