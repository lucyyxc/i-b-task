import React from 'react';
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

const IntroTitle = () => (
  <div className="title-text intro">
    <span>Welcome to the Bride Tribe!</span>
    <p className="">
      We're so glad you've joined and can't wait to show you your personalized wedding
      checklist! Let's start with a few questions, so we can get to know you better.
      This will help us put it all together for you.
    </p>
  </div>
);

const Title = ({user, tasks, loading, error, selected}) => {
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

  if (loading === false && error === null) {
    firstName = user.name.split(' ')[0];
    daysTill = moment(user.weddingDate).diff(moment(), 'days');
    initials = user.assignee;
  }

  return (
    <div className="Title">
      <div className="title-content">
        {selected === 'intro'
          ? <IntroTitle />
          : <LoggedInTitle {...{firstName, daysTill, toggleMenu, show, user, initials}} />
        }
      </div>
    </div>
  );
};

export default Title;
