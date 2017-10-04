import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LogInForm from './components/LogInForm.jsx';
import Auth from './modules/Auth';


class LogIn extends React.Component {

  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        email: '',
        password: ''
      }
    };

    this.logInUser = this.logInUser.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  componentWillMount () {
    // if the user is returning to this page AND still logged in: push him to main application!
    if (Auth.isUserAuthenticated()) {
      this.context.router.history.push('/main');
    }
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  logInUser(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // post the login data to the server
    fetch('auth/users/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.user)
    })
    // first convert the response to json-format
      .then(response => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          // successful login!

          // change the component-container state
          this.setState({
            errors: {}
          });

          // save the token
          Auth.authenticateUser(responseJson.token);

          // change the current URL to /
          this.context.router.history.push('/main');
        } else {
          // failure

          // server answered with some kind of error-message
          const errors = responseJson.errors ? responseJson.errors : {};
          errors.summary = responseJson.message;

          this.setState({
            errors
          });
        }
      })
      .catch((error) => {
        // TODO: proper error handling!
        console.log(error);
      });
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <MuiThemeProvider>
        <LogInForm
          onSubmit={this.logInUser}
          onChange={this.changeUser}
          errors={this.state.errors}
          successMessage={this.state.successMessage}
          user={this.state.user}
        />
      </MuiThemeProvider>
    );
  }

}

LogIn
  .contextTypes = {
  router: PropTypes.object.isRequired
};

export default LogIn;
