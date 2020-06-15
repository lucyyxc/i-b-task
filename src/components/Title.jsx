import React from 'react';
import moment from 'moment';

import ProfileMenu from './ProfileMenu';

import stars from '../styles/assets/stars.png';

const Title = ({user, tasks, loading}) => {
  const [show, setShow] = React.useState('hidden');

  const toggleMenu = () => {
    if (show) {
      setShow('');
    } else {
      setShow('hidden')
    }
  }

  let firstName = '';
  let daysTill = '';
  let initials = ''

  if (loading === false) {
    firstName = user.name.split(' ')[0];
    daysTill = moment(user.weddingDate).diff(moment(), 'days');
    initials = user.assignee;
  }

  return (
    <div className="Title">
    <div className="title-content">
      <div className="title-text">
        <div className="icon">
          <img src={stars} alt="Stars" />
        </div>
        <span>
          {`Hi ${firstName}, ${daysTill} days until your Big Day!`}
        </span>
      </div>
      <div className="profile-content">
        <div className="profile-holder">
          <div className="profile-circle" onClick={() => toggleMenu()}>
            {`${initials}`}
          </div>
          <ProfileMenu show={show} name={user.name} /> {/*TODO add sign out link*/}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Title;
