import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import Home from './pages/Home';
import Team from './pages/Team';
import About from './pages/About';

import { fetchStandings } from './actions/standings';
import { fetchTeams } from './actions/teams';
import { fetchLiveMatch } from './actions/liveMatch';
import { fetchMaps } from './actions/maps';
import { fetchSchedule } from './actions/schedule';

import registerServiceWorker from './registerServiceWorker';

const logger = createLogger({ collapsed: true, diff: true });
const middleware = [logger, promiseMiddleware()];
const enhancer = compose(
  applyMiddleware(...middleware),
);
const store = createStore(rootReducer, {}, enhancer);
store.dispatch(fetchStandings());
store.dispatch(fetchTeams());
store.dispatch(fetchLiveMatch());
store.dispatch(fetchMaps());
store.dispatch(fetchSchedule());

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/stage/:stage" component={Home} />
        <Route path="/team/:abbreviatedName/:matchId" component={Team} />
        <Route path="/team/:abbreviatedName" component={Team} />
        <Redirect from="/" to="/stage/overview" />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
