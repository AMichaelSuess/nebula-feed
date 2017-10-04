import React from 'react'
import { Switch, Route } from 'react-router-dom'

import LogIn from './LogIn'
import SignUp from './SignUp'
import Main from './Main'
import LogOut from './LogOut'


// The App component renders one of the provided Routes (provided that one matches)
const App = () => (
  <main>
    <Switch>
      <Route exact path='/' component={LogIn}/>
      <Route path='/signup' component={SignUp}/>
      <Route path='/main' component={Main}/>
      <Route path='/logout' component={LogOut}/>
    </Switch>
  </main>
);

export default App
