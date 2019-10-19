import React, { Component } from 'react';
import './App.css';
import TweetList from './components/TweetList';
import MenuBar from './components/MenuBar.component';
// Redux
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {
  render() {
    return (
      <div className="App">   
        <Provider store={store}>
          <MenuBar/> 
          <TweetList/>
        </Provider>    
      </div>
    );
  }
}

export default App;