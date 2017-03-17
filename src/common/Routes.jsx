import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';

import LoginPage            from '../PageLogin.jsx'
import HomePage             from '../PageHome.jsx'
import CompetitionListPage  from '../PageCompetitionList.jsx'
import CompetitionPage      from '../PageCompetition.jsx'
import EventRegistration    from '../PageEventRegistration.jsx'
import EditSchedule         from '../PageEditSchedule.jsx'
import RunCompetition       from '../PageRunCompetition.jsx'
import CompetitionHomeAdmin from '../PageCompetitionHomeAdmin.jsx'

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
      path="competition/:competition_id/:competitor_id"
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
