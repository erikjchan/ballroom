import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';

import LoginPage            from '../PageLogin/page.jsx';
import HomePage             from '../PageHome/page.jsx';
import CompetitionListPage  from '../PageCompetitionList/page.jsx'
import CompetitionPage      from '../PageCompetition/page.jsx'
import EventRegistration    from '../PageEventRegistration/page.jsx'
import EditSchedule         from '../PageEditSchedule/page.jsx'
import RunCompetition       from '../PageRunCompetition/page.jsx'
import CompetitionHomeAdmin       from '../PageCompetitionHomeAdmin/page.jsx'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={LoginPage} />
    <Route
      path="home"
      component={HomePage}
    />
    <Route 
      path="competition/:competition_id/eventregistration"
      component={EventRegistration}
    />
    <Route 
      path="competition/:competition_id/editschedule"
      component={EditSchedule}
    />
    <Route 
      path="competition/:competition_id/run"
      component={RunCompetition}
    />
    <Route 
      path="competition/:competition_id"
      component={CompetitionPage}
    />
    <Route 
      path="competitions"
      component={CompetitionListPage}
    />
    <Route 
      path="/admin/competition/:competition_id"
      component={CompetitionHomeAdmin}
    />
  </Route>
);
