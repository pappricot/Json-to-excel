import React, { Component } from 'react';
import './App.css';
import SearchBar from './Search';
import HtmlTable from './htmlTable';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Json-to-Excel</h1>
        </header>
        <br />
        <div className="container">
          <SearchBar />
          <HtmlTable />
        </div>
      </div>
    );
  }
}

export default App;
