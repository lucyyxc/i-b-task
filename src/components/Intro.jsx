import React from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment';
import axios from 'axios';
import passwordValidator from 'password-validator';
import Nav from './Nav';
import Footer from './Footer';

import "react-datepicker/dist/react-datepicker.css";

const IntroTitle = () => (
  <div className="title-text intro">
    <span>Welcome to the Bride Tribe!</span>
    <p className="">
      We're so glad you've joined and can't wait to show you your personalized wedding
      checklist! Let's start with a few questions, so we can get to know you better.
      This will help us put it all together for you.
    </p>
  </div>
)

const Input = ({type = 'text', placeholder = '', value, item, label, showWarning = false, warning, updateStateValue, showPassTooltip = false}) => {
  const [show, setShow] = React.useState(false);
  let displayType;

  if (type === 'password' && show) {
    displayType = 'text';
  } else {
    displayType = type;
  }

  const tooltip = <div className="tooltip">
      <i className="fas fa-info-circle"></i>
        <span className="tooltiptext">Password must be 8 characters long and contain the following:<br/> uppercase letter, lowercase letter, number.</span>
    </div>

  return (
    <div className="input-container">
      <div className="label-container">
        <span className="input-label">{label} {showPassTooltip ? tooltip : null}</span>
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
    valid: false,
    match: false,
    error: false,
  });
  const [redirect, setRedirect] = React.useState(false);

  
  let schema = new passwordValidator();
  schema.is().min(8)
  .has().lowercase()
  .has().lowercase()
  .has().digits()
  
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

  const validatePassword = (pass) => {
    return schema.validate(pass)
  };

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
    const metadata = {
      weddingDate: submittableWeddingDate,
      birthday: submittableBirthday,
      sub: 'false',
      fullName: state.name,
    };

    if (
      state.name &&
      state.weddingDate &&
      state.email &&
      state.validEmail &&
      state.birthday &&
      validatePassword(state.password) &&
      state.password &&
      state.match
    ) {
      console.log('posting');
      axios.post('https://the-independent-bride.us.auth0.com/dbconnections/signup',
        {
          client_id: 'MdY4v57ExoBNoxuM9MsFCMULtl44pFQ1',
          email: state.email,
          password: state.password,
          connection: 'Username-Password-Authentication',
          name: state.name,
          user_metadata: metadata
        }
      )
      .then(response => {
        console.log(response.data);
        console.log('sign up completed');
        setRedirect(true);
      })
      .catch(err => {
        // setState({
        //   ...state,
        //   error: true,
        // });
        console.log(err);
        //TODO Do something with this error state
      })
    }
  };

  const passwordWarning = validatePassword(state.password) ? 'Passwords do not match.' : 'Password does not meet requirements.'

  console.log(state);

  if (redirect) {
    window.location.href = `${process.env.REACT_APP_SERVERHOST}/auth`
  }

 return (
  <div className="Intro" >
    <Nav />
    <Footer />
    {IntroTitle()}
    <div className="signup">
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
        showWarning: (!validatePassword(state.password) && state.password) || (!state.match && state.password && state.confirm),
        warning: passwordWarning,
        showPassTooltip: true,
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
        <a href="/auth">Log In</a>
      </div>
      <div 
        className="submit"
        onClick={() => submit()}
      > {/*TODO add thinking animation to button */}
        <span className="label">Let's do this!</span>
      </div>
    </div>
  </div>
  );
};

export default Intro