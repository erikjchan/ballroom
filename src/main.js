/**
 * App entry point
 */

// Polyfill
import 'babel-polyfill';

// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import Routes from './common/Routes';
import './base.css';

// Render the router
ReactDOM.render((
  <Router history={browserHistory}>
    {Routes}
  </Router>
), document.getElementById('app'));

