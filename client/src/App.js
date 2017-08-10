import React, { Component } from 'react';
import Header from './components/Header.jsx'
import ColleagueList from './components/ColleagueList.jsx'
import './styles/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <ColleagueList />
      </div>
    );
  }
}

export default App;
