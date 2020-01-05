import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { configureStore } from './store';

import App from './components/app';
import Home from './components/home';
import { AUTH_USER } from './actions/types';


import '../style/style.scss';

const store = configureStore();
const token = localStorage.getItem('auth_jwt_token');

// if we have a token, consider the user to be signed in
if (token) {
  store.dispatch({type: AUTH_USER});
}
ReactDOM.render(
  <Provider store={ store }>
    <HashRouter hashType='noslash'>
      <App>
        <Switch>
          <Route
            exact
            path='/'
            component= { Home }
          />
        </Switch>
      </App>
    </HashRouter>
  </Provider>
  , document.getElementById('root'));
