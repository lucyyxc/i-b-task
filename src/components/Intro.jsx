import React from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

import LoginButton from './LoginButton';

const Input = ({type = 'text', placeholder = '', value, item, label, showWarning = false, warning, updateStateValue}) => {
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
        onChange={e => updateStateValue(item, e.target.value)}
      />
      {type === 'password'
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

const DateSelect = ({placeholder, value, item, label, updateStateValue}) => (
  <div className="date-container">
    <span className="date-label">{label}</span>
    <DatePicker
      selected={value}
      className='picker'
      placeholderText={placeholder}
      onChange={date => updateStateValue(item, date)} 
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  </div>
);

const Intro = ({updateView}) => {
  const [state, setState] = React.useState({
    name: '',
    weddingDate: '',
    email: '',
    validEmail: false,
    birthday: '',
    password: '',
    confirm: '',
    match: false,
  });

  React.useEffect(() => {
    checkPasswords()
  }, [state.password, state.confirm])

  const updateStateValue = (key, value) => {
    setState({
      ...state,
      [key]: value
    });
  }

  const validateEmail = (email) => /^.+@.+\..+$/.test(email);

  const emailInput = (key, value) => {
    if (validateEmail(value)) {
      setState({
        ...state,
        [key]: value,
        validEmail: true,
      });
    } else if (!validateEmail(value) && state.validEmail) {
      setState({
        ...state,
        [key]: value,
        validEmail: false,
      });
    } else {
      setState({
        ...state,
        [key]: value,
      });
    }
  }

  const checkPasswords = () => {
    if (
      state.password === state.confirm &&
      state.password &&
      state.confirm
    ) {
      setState({
        ...state,
        match: true,
      });
    } else if (
      state.password !== state.confirm &&
      state.password &&
      state.confirm
    ) {     
      setState({
        ...state,
        match: false,
      });
    }
  };

  const submit = () => {
    const submittableWeddingDate = moment(state.weddingDate).format('YYYY-MM-DD');
    const submittableBirthday = moment(state.birthday).format('YYYY-MM-DD');
    const submittableState = {
      name: state.name,
      weddingDate: submittableWeddingDate,
      email: state.email,
      birthday: submittableBirthday,
      password: state.password
    };

    if (
      state.name &&
      state.weddingDate &&
      state.email &&
      state.validEmail &&
      state.birthday &&
      state.password &&
      state.match
    ) {
      updateView('selected', 'checklist')
      //TODO submit that submittableState when it gets figured out
    } else {
      alert('you messed up somewhere dude')
      //TODO handle this more gracefully
    }
  };

 return (
  <div className="Intro" >
    <Input {...{
      value: state.name, 
      item: 'name', 
      label: 'Name', 
      updateStateValue
    }} />
    <DateSelect {...{
      value: state.weddingDate, 
      placeholder: 'Just give us your best guess. You can change this later when it\'s finalized!', 
      item: 'weddingDate', 
      label: 'Wedding Date', 
      updateStateValue
    }} />
    <Input {...{
      value: state.email, 
      type: 'email', 
      item: 'email', 
      label: 'Email Address',
      showWarning: !state.validEmail && state.email,
      warning: 'Invalid email address.',
      updateStateValue: emailInput
    }} /> {/*TODO won't we already have their email address? */}
    <DateSelect {...{
      value: state.birthday, 
      placeholder: 'We want to make you feel special on your birthday!', 
      item: 'birthday', 
      label: 'Birthday', 
      updateStateValue
    }} />
    <Input {...{value: 
      state.password, 
      type: 'password', 
      item: 'password', 
      label: 'Password',
      showWarning: !state.match && state.password && state.confirm,
      warning: 'Passwords do not match.',
      updateStateValue
    }} />
    <Input {...{
      value: state.confirm, 
      type: 'password', 
      item: 'confirm', 
      label: 'Confirm Password', 
      updateStateValue
    }} />
    <div className="member">
      <p>Already a part of the Bride Tribe?&nbsp;</p>
      <LoginButton />
    </div>
    <div 
      className="submit"
      onClick={() => submit()}
    > {/*TODO add thinking animation to button */}
      <span className="label">Let's do this!</span>
    </div>
  </div>
  );
};

export default Intro