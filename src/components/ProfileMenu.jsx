import React from 'react';

const ProfileMenu = ({show, name, toggleMenu}) => {
  const [modal, showModal] = React.useState(false);

  const logOut = () => {
    //TODO add log out logic here
    alert('logged out')
    showModal(false)
    toggleMenu()
  };

  const cancel = () => {
    showModal(false)
    toggleMenu()
  };

  if(show === 'hidden' && modal) showModal(false);

  return (
    <div className={`ProfileMenu ${show}`}>
      <div className="user-info">
        <div className="name">
          {`${name}`}
        </div>
        <div className="link">
          Manage Profile
        </div>
      </div>
      <hr />
      <div className="link" onClick={() => showModal(true)}>
        Log Out
      </div>
      <div className={`logout-confirm ${modal ? 'show': ''}`}>
        <span className="message">Are you sure?</span>
        <div className="button-holder">
          <div className="button" onClick={() => logOut()}><p>Log Out</p></div>
          <div className="button" onClick={() => cancel()}><p>Cancel</p></div>
        </div>
      </div>
    </div>
  )
};

export default ProfileMenu;
