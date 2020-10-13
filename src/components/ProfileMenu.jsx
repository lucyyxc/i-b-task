import React from 'react';

import Profile from './Profile';

const LogOutModal = ({modal, logOut, cancel}) => (
  <div className={`modal logout-confirm ${modal ? 'show': ''}`}>
    <span className="message">Are you sure?</span>
    <div className="button-holder">
      <div className="button" onClick={() => logOut()}><p>Log Out</p></div>
      <div className="button" onClick={() => cancel()}><p>Cancel</p></div>
    </div>
  </div>
);

const ProfileMenu = ({show, user, toggleMenu}) => {
  const [modal, showModal] = React.useState(false);
  const [display, swapDisplay] = React.useState('')

  const logOut = () => {
    //TODO add log out logic here
    alert('logged out')
    showModal(false)
    swapDisplay('')
    toggleMenu()
  };

  const cancel = () => {
    showModal(false)
    swapDisplay('')
    toggleMenu()
  };

  if(show === 'hidden' && modal) showModal(false);

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
