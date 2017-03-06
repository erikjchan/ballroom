import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import LoginPage from '../../pages/login/page.jsx';
import HomePage from '../../pages/home/page';
import SidebarPage from '../../pages/include/sidebar';



export default (
  <Route path="/" component={App}>
    <IndexRoute component={LoginPage} />
    <Route path="home" component={HomePage} />
    <Route path="sidebar" component={SidebarPage} />
  </Route>
);
