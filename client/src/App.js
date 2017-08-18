import React, { Component } from 'react';
import Header from './components/Header.jsx'
import ColleagueList from './components/ColleagueList.jsx'
import './styles/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colleagues: []
    }
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
  }

  componentDidMount() {
    this.fetchColleagues();
  }

  // load a list of all colleagues from '/api/colleagues'
  fetchColleagues () {
    var _this = this;
    fetch('api/colleagues')
    .then((resp) => resp.json())
    .then(function(data) {
      _this.setState({ colleagues: data });
    })
    .catch(function(error) {
      // TODO: real error logging
      console.log(error);
    });
  }

  onSubmitClick() {
    this.state.colleagues.forEach((colleague, index) => {
      this.onResetClick(index);
    });
  }

  onResetClick(index) {
    let colleagues = this.state.colleagues;

    colleagues[index].rating = 0;
    this.setState({ colleagues: colleagues });
  }

  onStarClick(nextValue, index) {
    let colleagues = this.state.colleagues;

    colleagues[index].rating = nextValue;
    this.setState({ colleagues: colleagues });
  }

  render() {
    return (
      <div className="App">
        <Header onSubmitClick={this.onSubmitClick} />
        <ColleagueList
          onResetClick={this.onResetClick}
          onStarClick={this.onStarClick}
          colleagues={this.state.colleagues}
        />
      </div>
    );
  }
}

export default App;
