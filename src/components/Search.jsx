import React from 'react';

const Input = ({placeholder = '', value = '', item, label, collab, updateCollab, showWarning = false, warning = ''}) => {
  return (
    <div className="input-container">
      <div className="label-container">
        <span className="input-label">{label}</span>
        <span className={`warning ${showWarning ? 'show' : ''}`}>{`*${warning}`}</span>
      </div>
      <input 
        type="text"
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={e => updateCollab({...collab, [item]: e.target.value})}
      />
    </div>
  );
};

const CollabForm = ({collab, warning, updateCollab, submit}) => (
  <>
    <h6 className="title">Add someone to help you with all the planning!</h6>
    <p className="blurb">By adding this collaborator, they'll have access to all tasks and you'll be able to assign tasks and with them as you go.</p>
    <div className="input-holder">
      <Input {...{
        value: collab.name,
        item: 'name', 
        label: 'Name',
        warning: 'This is a required field',
        showWarning: warning && !collab.name,
        collab,
        updateCollab,
      }} 
      />
      <Input {...{
        value: collab.email,
        item: 'email', 
        label: 'Email',
        warning: !(/^.+@.+\..+$/.test(collab.email)) && collab.email ? 'Please enter a valid email address' : 'This is a required field',
        showWarning: warning && (!collab.email || !(/^.+@.+\..+$/.test(collab.email))),
        collab,
        updateCollab,
        }}
      />
      <div className="input-container">
        <div className="label-container">
          <span className="input-label">Relationship to you</span>
          <span className={`warning ${warning && !collab.relation ? 'show' : ''}`}>*This is a required field</span>
        </div>
        <select
          id="relation"
          name="relation"
          onChange={(e) => updateCollab({...collab, relation: e.target.value})}
          value={collab.relation}
          className="input"
        >
          <option value="" disabled selected hidden>Please Select Relationship</option>
          <option value="fiance">Fiance</option>
          <option value="relative">Relative</option>
          <option value="maidOfHonor">Maid of Honor</option>
          <option value="bridesmaid">Bridesmaid</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
    <p className="required-note">Please note that all fields are required.</p>
    <div 
      className="submit"
      onClick={() => submit()}
    > {/*TODO add thinking animation to button */}
      <span className="label">Save changes</span>
    </div>
  </>
);

const SentCollabForm = () => (
  <>
    <h6 className="title sent">Thank you!</h6>
    <p className="blurb sent-blurb">
      We've recieved your collaborators information. They can expect to get an email notification with further 
      instructions in the new few minutes. Once they're all set up, you'll be able to start assigning tasks to them.
    </p>
    <p className="blurb sent-blurb">
      We're thrilled you have someone helping you with the wedding planning! You've got a lot on your plate and you'll 
      be sure to have more fun by sharing the workload and collaboration with someone else. Happy planning! 🥂
    </p>
  </>
);

const collabadded = () => (
  <div className="collabadded">
    Unfortunately, at this time we're only allowing one collaborator. Since you've already added your collaborator, 
    you're all set here. Happy planning! 🥂
  </div>
);

const CollabMenu = ({show, cancel, collab, updateCollab, submit, sent, warning, collabadded = false}) => (
  <div className={`CollabMenu ${show ? 'show' : ''} ${collabadded ? 'short' : ''}`}>
    <div className="control-holder">
      <div className="control exit" onClick={() => cancel()}>
        <i className="fas fa-times"></i>
      </div>
    </div>
    {collabadded
      ? <collabadded />
      : (!sent
          ? <CollabForm {...{collab, updateCollab, submit, warning}} />
          : <SentCollabForm />
        )
    }
    
    
  </div>
);

const Search = ({search, updateStateValue, collabadded, showSearch, getUserTasks}) => {
  const [show, toggleShow] = React.useState(false);
  const [sent, send] = React.useState(false);
  const [collab, updateCollab] = React.useState({name: '', email: '', relation: ''});
  const [warning, setWarning] = React.useState(false);

  const cancel = () => toggleShow(false);

  const submit = () => {
    if (
      collab.name &&
      collab.email &&
      (/^.+@.+\..+$/.test(collab.email)) &&
      collab.relation
    ) {
      //TODO submit collab info
      send(true)
    } else {
      setWarning(true)
    }
  };
  
  return (
    <div className="Search">
      <CollabMenu {...{show, cancel, collab, updateCollab, submit, sent, warning, collabadded}}/>
      <div className="search-content">
        {showSearch
          ? <div className="search-input">
              <i className="fas fa-search"></i>
              <input 
                placeholder="Search tasks"
                value={search}
                onChange={e => updateStateValue('search', e.target.value)} 
              />
            </div>
          : null
        }
        {/* <i className="fas fa-user-plus" onClick={() => toggleShow(true)}></i> TODO ADD IN NEW USER COMING LATER */}
        {/* <i className="far fa-question-circle"></i> TODO TODO HOW TO COMING LATER */}
      </div>
    </div>
  );
};

export default Search;
