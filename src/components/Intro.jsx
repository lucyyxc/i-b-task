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
    <span>Let's Get Started</span>
    <p className="">
      Congratulations on your engagement! We are honored to
      be a part of your wedding planning journey. Help us
      get to know you and create your profile to get started.
    </p>
  </div>
)

const TimeDropDown = ({updateStateValue, label, item, value}) => (
  <div className="input-container">
      <div className="label-container">
        <span className="input-label">{label}</span>
      </div>
      <select
        className="select"
        value={value}
        onChange={e => updateStateValue(item, e.target.value)}
      >
        <option value="" disabled selected hidden>Choose your wedding planning timeline.</option>
        <option value="6M">Six Months</option>
        <option value="1Y">One Year</option>
        <option value="2Y">Two Years</option>
      </select>
    </div>
)

const EmailOptIn = ({updateStateValue, value, item}) => (
  <div className="email-opt">
    <input type="checkbox" checked={value} onChange={() => updateStateValue(item, !value)}/>
    <div className="checkbox-text">You agree to email communication from The Independent Bride to the email address you provided. Unsubscribe at any time.</div>
  </div>
)

const Input = ({type = 'text', placeholder = '', value, item, label, showWarning = false, warning, updateStateValue, showPassTooltip = false, autocomplete}) => {
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
        autocomplete={autocomplete}
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

const handleDateChangeRaw = (e) => {
  e.preventDefault();
}

const DateSelect = ({placeholder, value, item, label, updateStateValue}) => (
  <div className="date-container">
    <span className="date-label">{label}</span>
    <DatePicker
      selected={value}
      onChangeRaw={handleDateChangeRaw}
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
    weddingdate: '',
    email: '',
    validEmail: false,
    birthday: '',
    password: '',
    confirm: '',
    valid: false,
    match: false,
    error: false,
    timeUntil: '',
    emailAgree: true,
    required: false,
    disabled: false,
    errorMessage: ''
  });
  const [redirect, setRedirect] = React.useState(false);

  
  let schema = new passwordValidator();
  schema.is().min(8)
  .has().lowercase()
  .has().uppercase()
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
        disabled: false
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
    const submittableweddingdate = moment(state.weddingdate).format('YYYY-MM-DD');
    const submittableBirthday = moment(state.birthday || new Date()).format('YYYY-MM-DD');
    const metadata = {
      weddingdate: submittableweddingdate,
      birthday: submittableBirthday,
      sub: 'false',
      fullName: state.name,
      emailAgree: state.emailAgree ? 'true' : 'false',
      timeUntil: state.timeUntil
    };

    if (
      state.name &&
      state.weddingdate &&
      state.email &&
      state.validEmail &&
      validatePassword(state.password) &&
      state.password &&
      state.timeUntil &&
      state.match
    ) {
      axios.post('/api/post/duplicateUser', {email: state.email.toLowerCase()})
      .then(response => {
        if (response.data.length) {
          setState({
            ...state,
            required: true,
            disabled: false,
            errorMessage: 'An account with this email already exists, please log in.'
          });
        } else {
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
            axios.post('/api/post/newUser', response.data)
            .then(response => {
              setRedirect(true);
            })
            .catch(err => {
              console.log(err);
            })
          })
          .catch(err => {
            console.log(err);
          })
        }
      })
    } else if (
      !state.name ||
      !state.weddingdate ||
      !state.email ||
      !state.password ||
      !state.timeUntil
    ) {
      setState({
        ...state,
        required: true,
        disabled: false,
        errorMessage: 'Please fill all required fields.'
      });
    }
  };

  const passwordWarning = validatePassword(state.password) ? 'Passwords do not match.' : 'Password does not meet requirements.'

  if (redirect) {
    window.location.href = `${process.env.REACT_APP_SERVERHOST}/auth`
  }

 return (
  <div className="Intro" >
    <Nav selected={'intro'}/>
    <Footer />
    {IntroTitle()}
    <div className="signup">
      <Input {...{
        value: state.name, 
        item: 'name', 
        label: 'Name*', 
        autocomplete: 'name',
        updateStateValue
      }} />
      <DateSelect {...{
        value: state.weddingdate, 
        placeholder: 'Give us your best guess, this can be updated later.', 
        item: 'weddingdate', 
        label: 'Wedding Date*', 
        updateStateValue
      }} />
      <TimeDropDown {...{
        label: 'Timeline*',
        item: 'timeUntil',
        value: state.timeUntil,
        updateStateValue
      }}/>
      <Input {...{
        value: state.email, 
        type: 'email', 
        item: 'email',
        autocomplete: 'email',
        label: 'Email Address*',
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
        label: 'Password*',
        autocomplete: 'current-password',
        showWarning: (!validatePassword(state.password) && state.password) || (!state.match && state.password && state.confirm),
        warning: passwordWarning,
        showPassTooltip: true,
        updateStateValue
      }} />
      <Input {...{
        value: state.confirm, 
        type: 'password', 
        item: 'confirm', 
        label: 'Confirm Password*',
        updateStateValue
      }} />
      <div className="required-field">* required field</div>
      <div class={`requireds ${state.required ? '' : 'hide'}`}>{state.errorMessage}</div>
      <EmailOptIn {...{
        updateStateValue,
        item: 'emailAgree',
        value: state.emailAgree
      }} />
      <div className="terms">By creating an account, you agree to the <a href="https://app.termly.io/document/terms-of-use-for-website/5866c9c2-7cc3-48b9-84dd-540558694e87" target="_blank" rel="noopener noreferrer">Terms of Service</a> and Acknowledge our <a href="https://app.termly.io/document/privacy-policy/0cda50da-d6f1-4c2c-9dd7-04a7e017d8d0" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</div>
      <div className="member">
        <p>Already a part of the Bride Tribe?&nbsp;</p>
        <a href="/auth" className="login-button">Log In</a>
      </div>
      <div 
        className={`submit ${state.disabled ? 'disabled' : ''}`}
        onClick={() => {
          if (!state.disabled) {
            setState({
              ...state,
              disabled: true
            })
            submit()
          }
        }}
      >
        <span className="label">Let's do this!</span>
      </div>
    </div>
  </div>
  );
};

export default Intro