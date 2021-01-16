import React from 'react';

import logoBlack from '../styles/assets/logoBlack.png'

const Nav = ({selected}) => (
  <div className="Nav">
    <div className={`nav-content-container ${selected}`}>
      {/* {selected === 'intro'
        ? null
        : <div className="logo-container">
            <img
              src={logoBlack}
              alt="Indepenent Bride Logo"
              className="logo"
            />
          </div>
      } */}
      <div className="logo-container">
        <img
          src={logoBlack}
          alt="Indepenent Bride Logo"
          className="logo"
        />
      </div>
      <div className="links-container">
        <a href="https://theindependentbride.com/home" className="link">
          Home
        </a>
        <a href="https://theindependentbride.com/the-checklist" className="link">
          The Checklist
        </a>
        <a href="https://theindependentbride.com/blogs" className="link">
          Blogs
        </a>
        <a href="https://theindependentbride.com/the-bride-tribe-community" className="link">
          The Bride Tribe Community
        </a>
        <a href="https://theindependentbride.com/our-story" className="link">
          Our Story
        </a>
        <a href="https://theindependentbride.com/contact-us" className="link">
          Contact Us
        </a>
      </div>
    </div>
    
  </div>
);

export default Nav;
