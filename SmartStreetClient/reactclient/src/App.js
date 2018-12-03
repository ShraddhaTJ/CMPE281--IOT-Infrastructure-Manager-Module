import React, { Component } from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Routing from './Routing';

class App extends Component {


  render() {
    return (
      <div className="App" >
          <BrowserRouter>
                      <div className="row">
                        <Routing />
                      </div>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
