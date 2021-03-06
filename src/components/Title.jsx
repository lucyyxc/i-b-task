import React from 'react';
import moment from 'moment';

const LoggedInTitle = ({firstName, daysTill, toggleMenu, initials, show, user}) => (
  <>
    <div className="title-text">
      <span>
        {`Hi ${firstName}, ${daysTill} days until your Big Day!`}
      </span>
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
