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
        <a href="/" className="link">
          Our Story
        </a>
        <a href="/" className="link">
          Membership
        </a>
        <a href="/" className="link">
          Checklist
        </a>
        <a href="/" className="link">
          Resources
        </a>
        <a href="/" className="link">
          Blog
        </a>
        <a href="/" className="link">
          Community
        </a>
        <a href="/" className="link">
          Contact Us
        </a>
      </div>
    </div>
    
  </div>
);

export default Nav;
