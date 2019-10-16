import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';
import socketIOClient from "socket.io-client";
import CardComponent from './CardComponent';


class TweetList extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [], searchTerm: "Javascript" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSearch() {
      this.handleResume();
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') this.handleResume();
  }

  handleResume() {
    let term = this.state.searchTerm;
    console.log('term : ', term)
    fetch("/setSearchTerm",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ term })
      })
  }

  handlePause(event) {
    fetch("/pause",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

componentDidMount() {
  const socket = socketIOClient('http://localhost:3000/');

  socket.on('connect', () => {
    console.log("Socket Connected");
    socket.on("tweets", data => {
      //console.info(data);
      let newList = [data].concat(this.state.items.slice(0, 15));
      this.setState({ items: newList });
    });
  });
  socket.on('disconnect', () => {
    socket.off("tweets")
    socket.removeAllListeners("tweets");
    console.log("Socket Disconnected");
  });
}

setSearchText() {

}


render() {
    let items = this.state.items;

    let itemsCards = <TransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        {items.map((x, i) =>
        <CardComponent key={i} data={x} />
        )}
    </TransitionGroup>;

    let searchControls =
      <div>
        <input 
            id="email" 
            type="text" 
            className="validate" 
            value={this.state.searchTerm} 
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
        />
        <button type='button' onClick={() => {this.handleSearch()}}>Search</button>
      </div>

    let filterControls = <div>
      <a className="btn-floating btn-small waves-effect waves-light pink accent-2" style={controlStyle} onClick={this.handleResume}><i className="material-icons">play_arrow</i></a>
      <a className="btn-floating btn-small waves-effect waves-light pink accent-2" onClick={this.handlePause} ><i className="material-icons">pause</i></a>
      <p>
        <input type="checkbox" id="test5" />
        <label htmlFor="test5">Retweets</label>
      </p>
    </div>

    let controls = <div>
      {
        items.length > 0 ? filterControls : null
      }
    </div>

    let loading = <div>
      <p className="flow-text">Listening to Streams</p>
      <div className="progress lime lighten-3">
        <div className="indeterminate pink accent-1"></div>
      </div>
    </div>

    return (
      <div className="row">
        <div className="col s12 m4 l4">
          <div className="input-field col s12">
            {searchControls}
            {
              items.length > 0 ? controls : null
            }
          </div>
        </div>
        <div className="col s12 m4 l4">
          <div>
            {
              items.length > 0 ? itemsCards : loading
            }

          </div>

        </div>
        <div className="col s12 m4 l4">
        </div>
      </div>
    );
  }
}

const controlStyle = {
  marginRight: "5px"
};

export default TweetList;