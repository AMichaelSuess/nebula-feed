import React, {Component} from 'react';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ColleagueList from './components/ColleagueList.jsx'
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
      colleagues: [],
      user: {},
      submitMsg: '',
      serverMsgDisplayed: false,
      serverMsg: '',
      confirmDialogOpen: false
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
    this.getColleagues();
    this.getCurrentUser();
  }

  /**
   * GET a list of all colleagues from '/api/colleagues' and put them into this.state
   */
  getColleagues() {
    let _this = this;
    fetch('api/colleagues', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${Auth.getToken()}`
      }
    })
      .then((resp) => resp.json())
      .then(function (data) {
        _this.setState({colleagues: data});
      })
      .catch(function (error) {
        // TODO: real error logging
        console.log(error);
      });
  }

  /**
   * GET information about currently logged in user - and put it into this.state
   */
  getCurrentUser() {
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

    this.state.colleagues.forEach((colleague, index) => {
      // only need to do something for the ones who have scores
      if (colleague.score > 0 && colleague.score < 6) {
        console.log(`${JSON.stringify(colleague)}`);

        let aRating = {
          fromUserId: "1234",
          msg: this.state.submitMsg,
          toColleagueId: colleague.colleagueId,
          score: colleague.score
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
            serverMsgDisplayed: true,
            serverMsg: responseJson.message
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
      serverMsgDisplayed: false,
    });
  };

  resetRating(index) {
    let colleagues = this.state.colleagues;

    colleagues[index].score = 0;
    this.setState({colleagues: colleagues});
  }

  changeRating(nextValue, index) {
    let colleagues = this.state.colleagues;

    colleagues[index].score = nextValue;
    this.setState({colleagues: colleagues});
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

  getNumRatedColleagues() {
    return this.state.colleagues.reduce(
      (total, colleague) => ((colleague.score > 0 && colleague.score < 6) ? total + 1 : total), 0);
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

    // how many rated colleagues do we have (needed for confirmDialog)
    const numRatedColleagues = this.getNumRatedColleagues();
    const ratedColleagues = (numRatedColleagues > 1) ?
      `${numRatedColleagues} people` : `${numRatedColleagues} person`;

    return (
      <div className="Main">
        <Header/>
        <ColleagueList
          onResetClick={this.resetRating}
          onStarClick={this.changeRating}
          colleagues={this.state.colleagues}
        />
        <Footer
          user={this.state.user}
          submitDisabled={this.getNumRatedColleagues() === 0}
          onSubmitClicked={this.openConfirmDialog}
        />
        <Snackbar
          open={this.state.serverMsgDisplayed}
          message={this.state.serverMsg}
          autoHideDuration={4000}
          onRequestClose={this.closeServerMsg}
        />
        <Dialog
          title={`You are about to grant stars to ${ratedColleagues}!`}
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
