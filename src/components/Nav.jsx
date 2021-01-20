import React from 'react';

import ProfileMenu from './ProfileMenu';

import logoBlack from '../styles/assets/logoBlack.png';
import whiteLogo from '../styles/assets/whiteLogo.png';
import pinkLogoNotCircle from '../styles/assets/pinkLogoNotCircle.jpg';

const ProfileContent = ({initials, toggleMenu, show, user}) => {
  return (
  <div className="profile-content">
      <div className="profile-holder">
        <div className="profile-circle" onClick={() => toggleMenu()}>
          {`${initials}`}
        </div>
        <ProfileMenu show={show} user={user} toggleMenu={toggleMenu} /> {/*TODO add sign out link*/}
      </div>
    </div>
  );
}

const Nav = ({selected, user = {}, loading, error}) => {
  const [show, setShow] = React.useState('hidden');

  const toggleMenu = () => {
    if (show) {
      setShow('');
    } else {
      setShow('hidden')
    }
  }

  let initials = ''

  if (loading === false && error === null && user.name) {
    initials = user.assignee;
  }

  return (
    <div className="Nav">
      <div className={`nav-content-container ${selected}`}>
        <div className="logo-container">
          <img
            src={logoBlack}
            alt="Indepenent Bride Logo"
            className="logo"
          />
        </div>
        <div className="links-container">
          <a href="https://theindependentbride.com/home" className="link nav-link">
            Home
          </a>
          <a href="https://theindependentbride.com/the-checklist" className="link nav-link">
            The Checklist
          </a>
          <a href="https://theindependentbride.com/blogs" className="link nav-link">
            Blogs
          </a>
          <a href="https://theindependentbride.com/the-bride-tribe-community" className="link nav-link">
            The Bride Tribe Community
          </a>
          <a href="https://theindependentbride.com/our-story" className="link nav-link">
            Our Story
          </a>
          <a href="https://theindependentbride.com/contact-us" className="link nav-link">
            Contact Us
          </a>
          {selected
            ? <ProfileContent {...{initials, user, toggleMenu, show}} />
            : null
          }
        </div>
      </div>
      <div className={`mobile-nav ${selected}`}>
        <img src={pinkLogoNotCircle} alt="" className="pink left" />
        <img src={whiteLogo} alt="" className="white" />
        <img src={pinkLogoNotCircle} alt="" className="pink right" />
      </div>
    </div>
  )
}

export default Nav;
