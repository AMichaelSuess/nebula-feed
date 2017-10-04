import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SignUpForm from './components/SignUpForm.jsx';


class SignUpPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        name: '',
        password: ''
      }
    };

    this.signUpUser = this.signUpUser.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Sign a new user up.
   *
   * @param {object} event - the JavaScript event object from the SignUpForm
   */
  signUpUser(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // post the new users data to the server
    fetch('auth/users', {
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

        if (!responseJson.success) {
          // server answered with some kind of error-message
          const errors = responseJson.errors ? responseJson.errors : {};
          errors.summary = responseJson.message;

          this.setState({
            errors
          });
          return;
        }
        // if you reach this point, everything went well on the server - and we have a new user!
        this.setState({
          errors: {}
        });

        // set a message to be displayed on the login-form
        localStorage.setItem('successMessage', responseJson.message);

        // make a redirect
        this.context.router.history.push('/');
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
        <SignUpForm
          onSubmit={this.signUpUser}
          onChange={this.changeUser}
          errors={this.state.errors}
          user={this.state.user}
        />
      </MuiThemeProvider>
    );
  }

}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default SignUpPage;
