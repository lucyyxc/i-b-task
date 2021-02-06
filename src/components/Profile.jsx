import React from 'react';

import DatePicker from "react-datepicker";
import moment from 'moment';
import axios from 'axios';
import _isEmpty from 'lodash/isEmpty'

import "react-datepicker/dist/react-datepicker.css";
import { update } from 'lodash';

const Input = ({type = 'text', placeholder = '', value = '', item, label, showWarning = false, warning = '', updateChangesValue, disabled}) => {
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
        onChange={e => updateChangesValue(item, e.target.value)}
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

const DateSelect = ({value, item, label, updateChangesValue, disabled}) => (
  <div className="date-container">
    <span className="date-label">{label}</span>
    <DatePicker
      selected={value}
      className='picker'
      onChange={updateChangesValue} 
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      disabled={disabled}
      dropdownMode="select"
    />
  </div>
);

const Profile = ({user, modal, cancel, getUserTasks, getUserInfo}) => {
  const [profile, updateProfile] = React.useState({name: ''});
  const [show, toggleShow] = React.useState(false);
  const [edit, toggleEdit] = React.useState(false);
  const [changes, changeChanges] = React.useState({
    name: '',
    weddingdate: '',
    birthday: '',
  })
  if (_isEmpty(user)) return null;
  
  if (!_isEmpty(user) && profile.name !== user.name) {
    updateProfile({...user})
  }

  const updateChangesValue = (key, value) => {
    changeChanges({
      ...changes,
      [key]: value
    });
  }

  const submit = () => {
    const updates = [];
    if (changes.name) updates.push(axios.post('/api/post/usersNameUpdate', { name: changes.name }))
    if (changes.weddingdate) updates.push(axios.post('/api/post/weddingDateUpdate', { weddingdate: changes.weddingdate }))
    if (changes.birthday) updates.push(axios.post('/api/post/birthdayUpdate', { birthday: changes.birthday }))
    if (update.length) {
      axios.all(updates)
      .then(responses => {
        getUserInfo()
        updateProfile({name: ''})
        cancelCleanup()
      })
      .catch(err => console.log('updating profile error' ,err))
    }
  }

  const cancelCleanup = () => {
    toggleShow(false)
    toggleEdit(false)
    updateProfile({name: ''})
    changeChanges({name: '', weddingdate: '', birthday: '',})
    cancel();
  };

  return (
    <div className={`modal Profile ${modal ? 'show': ''}`} onClick={e => e.stopPropagation()}>
      <div className="control-holder">
        <div className="control" onClick={() => toggleEdit(!edit)}>
          <i className="fas fa-edit"></i>
        </div>
        <div className="control exit" onClick={() => toggleShow(true)}>
          <i className="fas fa-times"></i>
        </div>
      </div>
      <h1 className="title">
        {`Hi there, ${profile.name ? profile.name.split(' ')[0] : null}`}
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
          value: changes.name ? changes.name : profile.name,
          item: 'name', 
          label: 'Name', 
          warning: 'This is a required field',
          showWarning: !profile.name,
          disabled: !edit,
          updateChangesValue,
          }} 
        />
        {/* <Input {...{      Need to figure out how to do this in Auth0
          value: profile.email,
          item: 'email', 
          label: 'Email',
          warning: 'This is a required field', 
          showWarning: !profile.email,
          disabled: !edit,
          updateChangesValue,
          }}
        /> */}
        <DateSelect {...{
          value:  changes.weddingdate ? moment(changes.weddingdate).toDate() : moment(profile.weddingdate).toDate(), 
          item: 'weddingdate', 
          label: 'Wedding Date', 
          disabled: !edit,
          updateChangesValue: (date) => updateChangesValue('weddingdate', moment(date).format('YYYY-MM-DD')),
        }} />
        <DateSelect {...{
          value: changes.birthday ? moment(changes.birthday).toDate() : moment(profile.birthday).toDate(),
          placeholder: 'We want to make you feel special on your birthday!',
          item: 'birthday', 
          label: 'Birthday', 
          disabled: !edit,
          updateChangesValue: (date) => updateChangesValue('birthday', moment(date).format('YYYY-MM-DD')),
        }} />
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