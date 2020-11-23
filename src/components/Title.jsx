import React, { useReducer } from 'react';
import moment from 'moment';

import ProfileMenu from './ProfileMenu';

import stars from '../styles/assets/stars.png';

const LoggedInTitle = ({firstName, daysTill, toggleMenu, initials, show, user}) => (
  <>
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
        <ProfileMenu show={show} user={user} toggleMenu={toggleMenu} /> {/*TODO add sign out link*/}
      </div>
    </div>
  </>
);


const Title = ({user = {}, loading, error}) => {
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

  if (loading === false && error === null && user.name) {
    firstName = user.name.split(' ')[0];
    daysTill = moment(user.weddingdate).diff(moment(), 'days');
    initials = user.assignee;
  }

  return (
    <div className="Title">
      <div className="title-content">
        <LoggedInTitle {...{firstName, daysTill, toggleMenu, show, user, initials}} />
      </div>
    </div>
  );
};

export default Title;
