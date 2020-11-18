import React from 'react';

import DatePicker from "react-datepicker";
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty'

import "react-datepicker/dist/react-datepicker.css";

const Input = ({type = 'text', placeholder = '', value = '', item, label, showWarning = false, warning = '', updateStateValue, disabled}) => {
  const [show, setShow] = React.useState(false);
  let displayType;

  if (type === 'password' && show) {
    displayType = 'text';
  } else {
    displayType = type;
  }

  return (
    <div className="input-container">
      <div className="label-container">
        <span className="input-label">{label}</span>
        <span className={`warning ${showWarning ? 'show' : ''}`}>{`*${warning}`}</span>
      </div>
      <input 
        type={displayType}
        className="input"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={e => updateStateValue(item, e.target.value)}
      />
      {type === 'password' && !disabled
        ? <div className={`visable-text ${show ? 'show' : ''}`} onClick={() => setShow(!show)}>
            {show === false
            ? <i className="far fa-eye" title="See password"></i>
            : <i className="far fa-eye-slash"  title="Hide password"></i>
          }
          </div>
        : null
      }
    </div>
  );
};

const DateSelect = ({value, item, label, updateStateValue, disabled}) => (
  <div className="date-container">
    <span className="date-label">{label}</span>
    <DatePicker
      selected={value}
      className='picker'
      onChange={updateStateValue} 
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      disabled={disabled}
      dropdownMode="select"
    />
  </div>
);

const Profile = ({user, modal, cancel}) => {
  const [profile, updateProfile] = React.useState({name: ''});
  const [show, toggleShow] = React.useState(false);
  const [edit, toggleEdit] = React.useState(false);
  if (_isEmpty(user)) return null;

  
  if (!profile.name && !_isEmpty(user)) {
    updateProfile({...user})
  }

  const updateStateValue = (key, value) => {
    updateProfile({
      ...profile,
      [key]: value
    });
  }

  const submit = () => {
    if (
      profile.name &&
      profile.email &&
      profile.weddingDate &&
      profile.birthday &&
      profile.password
    ) {
      alert('profile saved');
      //TODO save this to the DB
      cancelCleanup();
    }
  }

  const cancelCleanup = () => {
    toggleShow(false)
    toggleEdit(false)
    cancel();
  };

  return (
    <div className={`modal Profile ${modal ? 'show': ''}`} >
      <div className="control-holder">
        <div className="control" onClick={() => toggleEdit(!edit)}>
          <i className="fas fa-edit"></i>
        </div>
        <div className="control exit" onClick={() => toggleShow(true)}>
          <i className="fas fa-times"></i>
        </div>
      </div>
      <h1 className="title">
        {`👋 Hi there, ${profile.name.split(' ')[0]}`}
        <div className={`cancel-confirm ${show ? 'show': ''}`}>
          <span className="message">Do you want to save your changes?</span>
          <div className="button-holder">
            <div className="button" onClick={() => submit()}><p>Yes, please save!</p></div>
            <div className="button" onClick={() => cancelCleanup()}><p>No thanks!</p></div>
          </div>
        </div>
      </h1>
      <p className="blurb">Here's all of your information. If anything changes, please update it here by clicking the pencil
        in the top left corner, so we have the most accurate information for you!
      </p>
      <div className="input-holder">
        <span className={`edit-mode ${edit ? 'show' : ''}`}>Edit Mode</span>
        <Input {...{
          value: profile.name,
          item: 'name', 
          label: 'Name', 
          warning: 'This is a required field',
          showWarning: !profile.name,
          disabled: !edit,
          updateStateValue,
          }} 
        />
        <Input {...{
          value: profile.email,
          item: 'email', 
          label: 'Email',
          warning: 'This is a required field', 
          showWarning: !profile.email,
          disabled: !edit,
          updateStateValue,
          }}
        />
        <DateSelect {...{
          value:  moment(profile.weddingDate).toDate(), 
          item: 'weddingDate', 
          label: 'Wedding Date', 
          disabled: !edit,
          updateStateValue: (date) => updateProfile({...profile, weddingDate: moment(date).format('YYYY-MM-DD')}),
        }} />
        <DateSelect {...{
          value: moment(profile.birthday).toDate(),
          placeholder: 'We want to make you feel special on your birthday!', 
          item: 'birthday', 
          label: 'Birthday', 
          disabled: !edit,
          updateStateValue: (date) => updateProfile({...profile, birthday: moment(date).format('YYYY-MM-DD')}),
        }} />
        <Input {...{
          value: profile.password,
          type: 'password', 
          item: 'password', 
          label: 'Password',
          showWarning: !profile.password,
          warning: 'This is a required field',
          disabled: !edit,
          updateStateValue,
          }}
        />
      </div>
      <div 
        className="submit"
        onClick={() => submit()}
      > {/*TODO add thinking animation to button */}
        <span className="label">Save changes</span>
      </div>
    </div>
  );
};

export default Profile