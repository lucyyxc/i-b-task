import React from 'react';

const ProfileMenu = ({show, name}) => (
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
    <div className="link">
      Log Out
    </div>
  </div>
);

export default ProfileMenu;
