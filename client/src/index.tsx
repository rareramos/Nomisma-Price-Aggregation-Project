import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { App } from './components/app';
import { Home } from './components/home';
import { store } from './store/configure-store';

import '../style/style.scss';

ReactDOM.render(
  // @ts-ignore
  <Provider store={store}>
    <HashRouter hashType="noslash">
      <App>
        <Switch>
          <Route
            exact
            path="/"
            component={Home}
          />
        </Switch>
      </App>
    </HashRouter>
  </Provider>,
  document.getElementById('root'),
);
