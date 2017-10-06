import React, {Component} from 'react';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ColleagueList from './components/ColleagueList.jsx'
import Auth from './modules/Auth';
import './styles/Main.css';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colleagues: [],
      user: {}
    };
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

  submitRating() {
    let reqArr = [];

    this.state.colleagues.forEach((colleague, index) => {
      // only need to do something for the ones who have scores
      if (colleague.score > 0 && colleague.score < 6) {
        console.log(`${JSON.stringify(colleague)}`);

        let aRating = {
          fromUserId: "1234",
          msg: "From Client!",
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
    });
  }

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
        />
      </div>
    );
  }
}

export default Main;
