import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './styles/main.scss';
import App from './components/App';
import Intro from './components/Intro';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation'
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

ReactDOM.render(
    <Router>
      <Switch>
        <Route exact path="/checklist">
          <App {...{selected: 'checklist'}} />
        </Route>
        <Route exact path="/calendar">
          <App {...{selected: 'calendar'}} />
        </Route>
        <Route exact path="/files">
          <App {...{selected: 'files'}} />
        </Route>
        <Route exact path="/progress">
          <App {...{selected: 'progress'}} />
        </Route>
        <Route exact path="/payment">
          <Payment />
        </Route>
        <Route exact path="/confirmation">
          <Confirmation />
        </Route>
        <Route path="/">
          <Intro />
        </Route>
      </Switch>
    </Router>,
  document.getElementById('root')
);
