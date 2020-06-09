import React from 'react';

const ProfileMenu = ({show}) => (
  <div className={`ProfileMenu ${show}`}>
    <div className="user-info">
      <div className="name">
        {`Bri Holst` /*TODO fill with props*/}
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
