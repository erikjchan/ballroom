/**
 * App entry point
 */

/******************************* Routes go here *******************************/

import LoginPage             from './PageLogin/page.jsx';
import HomePage              from './PageHome/page.jsx';
import CompetitionListPage   from './PageCompetitionList/page.jsx'
import CompetitionPage       from './PageCompetition/page.jsx'
import EventRegistration     from './PageEventRegistration/page.jsx'
import EditSchedule          from './PageEditSchedule/page.jsx'
import RunCompetition        from './PageRunCompetition/page.jsx'
import CompetitionHomeAdmin  from './PageCompetitionHomeAdmin/page.jsx'
import CompetitorSearchAdmin from './PageCompetitorSearch'

const routes = {
  'home'                                          : HomePage,
  'competition/:competition_id/eventregistration' : EventRegistration,
  'competition/:competition_id/editschedule'      : EditSchedule,
  'competition/:competition_id/run'               : RunCompetition,
  'competition/:competition_id/:competitor_id'    : CompetitionPage,
  'competitions'                                  : CompetitionListPage,
  'admin/competition/:competition_id'             : CompetitionHomeAdmin,
  'admin/competition/:competition_id/competitorsearch' : CompetitorSearchAdmin,
}

/*************************** Acutally runs the show ***************************/

// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import './base.css';
import { Route, IndexRoute, Router, browserHistory } from 'react-router';
import App from './common/App';

// Render the router
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LoginPage} />
      { Object.keys(routes).map(path => 
        <Route path={path} component={routes[path]} />
      )}
    </Route>
  </Router>
), document.getElementById('app'));
