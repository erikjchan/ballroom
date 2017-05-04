/**
 * App entry point
 */

// Polyfill
import 'babel-polyfill';

// Libraries
import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import { Router, browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk'
import api from './actions/middleware/ballroom_api'
// import api from './actions/middleware/api'

// Source files
import Routes from './common/Routes.jsx';
import ballroomApp from './reducers'
import './base.css';

class Root extends React.Component {
  render () {
    const { store } = this.props
    window.dispatch = store.dispatch
    return (<Provider store={this.props.store}>
      <Router history={browserHistory}>
        {Routes}
      </Router>
    </Provider>)
  }
}

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore)

// Render the router
ReactDOM.render(
  <Root store={createStoreWithMiddleware(ballroomApp)} />,
  document.getElementById('app'));

