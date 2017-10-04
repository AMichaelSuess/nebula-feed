import React from 'react';
import Auth from './modules/Auth';
import { Redirect } from 'react-router-dom';

class LogOut extends React.Component {
  componentWillMount() {
    // delete jwt-token - therewith effectively logging the user out
    Auth.deauthenticateUser();
  }

  //
  render () {
    return ( <Redirect to="/"/> );
  }
}

export default LogOut;
