import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import Authorization from './Authorization.jsx'

/** All the routes */
import LoginPage            from '../PageLogin.jsx'
import HomePage             from '../PageHome.jsx'
import CompetitionListPage  from '../PageCompetitionList.jsx'
import CompetitionPage      from '../PageCompetition.jsx'
import EventRegistration    from '../PageEventRegistration.jsx'
import EditSchedule         from '../PageEditSchedule.jsx'
import RunCompetition       from '../PageRunCompetition.jsx'
import CompetitionHomeAdmin from '../PageCompetitionHomeAdmin.jsx'
import CompetitorsList      from '../PageCompetitorList.jsx'
import EditProfile          from '../PageEditProfile.jsx'
import EnterCallbacks       from '../PageEnterCallbacks.jsx'
import EditCompetition      from '../PageEditCompetition.jsx'
import EditOfficial         from '../PageEditOfficial.jsx'
import EditLevelsAndStyles  from '../PageEditLevelsAndStyles.jsx'
import EditEvents           from '../PageEditEvents.jsx'
import SeeCompetitor        from '../PageSeeCompetitor.jsx'
import RegisterCompetitor   from '../PageRegisterCompetitor.jsx'

/**
 * Semantics:
 *   User pages can be accessed by 'user', 'judge' and 'admin'
 *   Judge pages can be accessed by 'judge' and 'admin'
 *   Admin pages can be accessed by 'admin'
 */
const Any   = Authorization(Authorization.ALL)
const User  = Authorization(['user', 'judge', 'admin'])
const Judge = Authorization(['judge', 'admin'])
const Admin = Authorization(['admin'])

const routes = {
  'home'                                                       : Any(HomePage),
  'competition/:competition_id/eventregistration'              : User(EventRegistration),
  'competition/:competition_id/editschedule'                   : Admin(EditSchedule),
  'competition/:competition_id/run'                            : Judge(RunCompetition),
  'competition/:competition_id/editlevelsandstyles'            : Admin(EditLevelsAndStyles),
  'competition/:competition_id/editevents'                     : Admin(EditEvents),
  'competition/:competition_id/competitorslist'                : Admin(CompetitorsList),
  'competition/:competition_id/:competitor_id'                 : User(CompetitionPage),
  'competitions'                                               : User(CompetitionListPage),
  'admin/competition/:competition_id'                          : Admin(CompetitionHomeAdmin),
  'editprofile'                                                : User(EditProfile),
  'competition/:competition_id/round/:round_id/entercallbacks' : Judge(EnterCallbacks),
  'editcompetition/:competition_id'                            : Admin(EditCompetition),
  'editofficial/:competition_id'                               : Admin(EditOfficial), 
  'competition/:competition_id/seecompetitor/:competitor_id'   : Admin(SeeCompetitor),
  'competition/:competition_id/regcompetitor/:competitor_id'   : Admin(RegisterCompetitor),
}

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Any(LoginPage)} />
    { Object.keys(routes)
      .map((route, i) => <Route key={i} path={route} component={routes[route]} />) }
  </Route>
);
