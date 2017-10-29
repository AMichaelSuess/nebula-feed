import React, {Component} from 'react';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ColleagueList from './components/ColleagueList.jsx'
import Snackbar from 'material-ui/Snackbar';
import Auth from './modules/Auth';
import './styles/Main.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colleagues: [],
      user: {},
      submitMsg: '',
      serverMsgDisplayed: false,
      serverMsg: ''
    };
    this.changeSubmitMsg = this.changeSubmitMsg.bind(this);
    this.submitRating = this.submitRating.bind(this);
    this.resetRating = this.resetRating.bind(this);
    this.changeRating = this.changeRating.bind(this);
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

  onSnackBarClose = () => {
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

  render() {
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
          onSubmitClick={this.submitRating}
          onSubmitMsgChanged={this.changeSubmitMsg}
        />
        <Snackbar
          open={this.state.serverMsgDisplayed}
          message={this.state.serverMsg}
          autoHideDuration={4000}
          onRequestClose={this.onSnackBarClose}
        />
      </div>
    );
  }
}

export default Main;
