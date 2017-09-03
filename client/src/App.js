import React, {Component} from 'react';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ColleagueList from './components/ColleagueList.jsx'
import './styles/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colleagues: []
    };
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
  }

  componentDidMount() {
    this.fetchColleagues();
  }

  // load a list of all colleagues from '/api/colleagues'
  fetchColleagues() {
    let _this = this;
    fetch('api/colleagues')
      .then((resp) => resp.json())
      .then(function (data) {
        _this.setState({colleagues: data});
      })
      .catch(function (error) {
        // TODO: real error logging
        console.log(error);
      });
  }

  onSubmitClick() {
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
        this.onResetClick(index);
      }
    });

    fetch('api/ratings/bulkInsert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqArr)
    });
  }

  onResetClick(index) {
    let colleagues = this.state.colleagues;

    colleagues[index].score = 0;
    this.setState({colleagues: colleagues});
  }

  onStarClick(nextValue, index) {
    let colleagues = this.state.colleagues;

    colleagues[index].score = nextValue;
    this.setState({colleagues: colleagues});
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <ColleagueList
          onResetClick={this.onResetClick}
          onStarClick={this.onStarClick}
          colleagues={this.state.colleagues}
        />
        <Footer onSubmitClick={this.onSubmitClick}/>
      </div>
    );
  }
}

export default App;
