import React from 'react';

import ProfileMenu from './ProfileMenu';

import stars from '../styles/assets/stars.png';

const Title = () => {
  const [show, setShow] = React.useState('hidden');

  const toggleMenu = () => {
    if (show) {
      setShow('');
    } else {
      setShow('hidden')
    }
  }

  return (
    <div className="Title">
    <div className="title-content">
      <div className="title-text">
        <div className="icon">
          <img src={stars} alt="Stars" />
        </div>
        <span>
          {`Hi Bri, 113 days until your Big Day!` /*TODO fill with props*/}
        </span>
      </div>
      <div className="profile-content">
        <div className="profile-holder">
          <div className="profile-circle" onClick={() => toggleMenu()}>
            {`BH` /*TODO fill with props*/}
          </div>
          <ProfileMenu show={show} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Title;
