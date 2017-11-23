import React, {Component} from 'react';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import UserListForRating from './components/UserListForRating.jsx'
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import Auth from './modules/Auth';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import './styles/Main.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: {},
      submitMsg: '',
      serverSuccessMsgDisplayed: false,
      serverSuccessMsg: '',
      confirmDialogOpen: false,
      warningMsg: ''
    };
    this.changeSubmitMsg = this.changeSubmitMsg.bind(this);
    this.submitRating = this.submitRating.bind(this);
    this.resetRating = this.resetRating.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.openConfirmDialog = this.openConfirmDialog.bind(this);
    this.cancelConfirmDialog = this.cancelConfirmDialog.bind(this);
    this.submitConfirmDialog = this.submitConfirmDialog.bind(this);
  }

  componentDidMount() {
    this.getCurrentUserAndUsers();
  }

  /**
   * GET a list of all users from '/api/users' which can be rated and put them into this.state.
   *
   * Include only users that can be rated. Exclude your own user.
   */
  getUsers() {
    let _this = this;
    fetch(`api/users?rights-inc=canBeRated&userId-ne=${this.state.user.userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then((resp) => resp.json())
      .then(function (data) {
        _this.setState({users: data});
      })
      .catch(function (error) {
        // TODO: real error logging
        console.log(error);
      });
  }

  /**
   * GET information about currently logged in user - and put it into this.state
   */
  getCurrentUserAndUsers() {
    let _this = this;
    fetch('api/users/me', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then((resp) => resp.json())
      .then(function (data) {
        _this.setState({user: data});
        // we have to wait for the result, as we don't want to see our own user in the rating list

        // put up warning message in case we don't have rights to rate
        if (!data.rights.includes("canRate")) {
          _this.setState({
            warningMsg: "You are not allowed to rate, please contact your friendly" +
            " admin if you think this is a mistake!"
          });
        }

        _this.getUsers();
      })
      .catch(function (error) {
        // TODO: real error logging
        console.log(error);
      });
  }

  changeSubmitMsg(newMsg) {
    this.setState({
      submitMsg: newMsg
    });
  }

  submitRating() {
    let reqArr = [];

    this.state.users.forEach((user, index) => {
      // only need to do something for the ones who have scores
      if (user.score > 0 && user.score < 6) {
        console.log(`${JSON.stringify(user)}`);

        let aRating = {
          fromUserId: this.state.user.userId,
          msg: this.state.submitMsg,
          toUserId: user.userId,
          score: user.score
        };
        reqArr.push(aRating);
        this.resetRating(index);
      }
    });

    fetch('api/ratings/bulkInsert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      },
      body: JSON.stringify(reqArr)
    })
      .then(response => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          this.setState({
            serverSuccessMsgDisplayed: true,
            serverSuccessMsg: responseJson.message
          });
        } else {
          // TODO: real error logging
          console.log("Could not submit rating :-(")
        }
      });
    // in any case: don't forget to reset the submitMessage!
    this.changeSubmitMsg("");
  }

  closeServerMsg = () => {
    this.setState({
      serverSuccessMsgDisplayed: false,
    });
  };

  resetRating(index) {
    let users = this.state.users;

    users[index].score = 0;
    this.setState({users: users});
  }

  changeRating(nextValue, index) {
    let users = this.state.users;

    users[index].score = nextValue;
    this.setState({users: users});
  }

  openConfirmDialog() {
    this.setState({confirmDialogOpen: true});
  }

  cancelConfirmDialog() {
    this.setState({confirmDialogOpen: false});
  }

  submitConfirmDialog() {
    this.setState({confirmDialogOpen: false});
    this.submitRating();
  }

  getNumRatedUsers() {
    return this.state.users.reduce(
      (total, users) => ((users.score > 0 && users.score < 6) ? total + 1 : total), 0);
  }

  render() {
    // confirmation dialog actions
    const actions = [
      <RaisedButton
        label="Cancel"
        onClick={this.cancelConfirmDialog}
      />,
      <RaisedButton
        label="Submit"
        secondary={true}
        onClick={this.submitConfirmDialog}
      />,
    ];

    // how many rated users do we have (needed for confirmDialog)
    const numRatedUsers = this.getNumRatedUsers();
    const ratedUsers = (numRatedUsers > 1) ?
      `${numRatedUsers} people` : `${numRatedUsers} person`;

    return (
      <div className="Main">
        <Header/>

        {this.state.warningMsg && <p className="error-message">{this.state.warningMsg}</p>}

        <UserListForRating
          onResetClick={this.resetRating}
          onStarClick={this.changeRating}
          ratingsEnabled={typeof this.state.user.rights !== 'undefined'
          && this.state.user.rights.includes("canRate")}
          users={this.state.users}
        />
        <Footer
          user={this.state.user}
          submitDisabled={this.getNumRatedUsers() === 0}
          onSubmitClicked={this.openConfirmDialog}
        />
        <Snackbar
          open={this.state.serverSuccessMsgDisplayed}
          message={this.state.serverSuccessMsg}
          autoHideDuration={4000}
          onRequestClose={this.closeServerMsg}
        />
        <Dialog
          title={`You are about to grant stars to ${ratedUsers}!`}
          actions={actions}
          modal={true}
          open={this.state.confirmDialogOpen}
        >
          <TextField
            floatingLabelText="Please describe the business value created (optional):"
            hintText="160 characters maximum"
            fullWidth={true}
            multiLine={true}
            rows={1}
            maxLength={160}
            onChange={(e, newValue) => this.changeSubmitMsg(newValue)}
          />
        </Dialog>
      </div>
    );
  }
}

export default Main;
