import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import logger from 'redux-logger';

import { rootSaga } from '../sagas';
import rootReducer from '../reducers';

const history = createBrowserHistory();

export function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
    logger,
  ];
  const appliedMiddlewares = [applyMiddleware(...middlewares)];

  // integrate Redux DevTools, if available
  const composedEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const enhancers = composedEnhancers(...appliedMiddlewares);

  const store =  createStore(
    rootReducer,
    {},
    enhancers,
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
