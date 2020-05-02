import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Room from './room';
import Chatroom from './chatroom';

import {
  Container
} from "@material-ui/core";


function App() {
  return (
    <Router>
      <Container maxWidth="sm">
        <Switch>
          <Route path="/room/:name">
            <Chatroom />
          </Route>
          <Route path="/">
            <Room />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
