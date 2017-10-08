import React from 'react'
import {Switch, Route} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import LogIn from './LogIn'
import SignUp from './SignUp'
import Main from './Main'
import LogOut from './LogOut'


// The App component renders one of the provided Routes (provided that one matches)
const App = () => (
  <MuiThemeProvider>
    <main>
      <Switch>
        <Route exact path='/' component={LogIn}/>
        <Route path='/signup' component={SignUp}/>
        <Route path='/main' component={Main}/>
        <Route path='/logout' component={LogOut}/>
      </Switch>
    </main>
  </MuiThemeProvider>
);

export default App
