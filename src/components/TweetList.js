import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TextField from '@material-ui/core/TextField'
import socketIOClient from "socket.io-client";
import CardComponent from './CardComponent';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import Link from '@material-ui/core/Link';
import { notify } from '../actions/notify.action';
import { trackTweets } from '../actions/search.action';
import store from '../store';

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
        marginTop:34
    },
    input: {
        display: 'none',
    }
});


class TweetList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        items: [], 
        searchTerm: store.getState().trackTweets.searchTermUpdated, 
        totalList: [] 
    };
    this.handlePause = this.handlePause.bind(this);
    this.count = 0;

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
  const { notify } = this.props;

  socket.on('connect', () => {
    console.log("Socket Connected");

    socket.on("tweets", data => {
        this.count += 1;
        notify(this.count)
        let ogList = [data].concat(this.state.totalList);
        let newList = [data].concat(this.state.items);
        if (newList.length <=25) {
            //totalList stores all the incoming tweets
            //items stores tweets which is has been loaded
            this.setState({ items: newList, totalList: ogList });
        } 
        else this.setState({totalList: ogList})
    });
  });

  socket.on('disconnect', () => {
    socket.off("tweets")
    socket.removeAllListeners("tweets");
    console.info("Socket Disconnected");
  });
}

componentDidUpdate(prevProps, prevState) {
    if (store.getState().notify.notificationCounter === 0) {
        //If notofication Icon is clicked then couter wikk reset to 0
        this.count = 0;
    }
    if (prevState.searchTerm != store.getState().trackTweets.searchTermUpdated) {
        this.setState({searchTerm: store.getState().trackTweets.searchTermUpdated})
    }
    if (prevState.searchTerm && prevState.searchTerm != store.getState().trackTweets.searchTermUpdated) {
        this.setState({items: [], totalList:[]})
    }
}



/**
 * @description Function to load more tweets
 */
loadMoreTweets() {
    const { items } = this.state;
    let duplicateList = items.concat(this.state.totalList)
    let newList = [...new Set(duplicateList)]; //remove duplicate items after concatinating
    this.setState({items : newList})
}

render() {
    const { items, totalList } = this.state;
    const { classes, trackTweets } = this.props;

    let itemsCards = <TransitionGroup className="tweet_container">
        {
            items.map((x, id) =>
                <CSSTransition  key={id} timeout={500}>                
                    <CardComponent data={x} />
                </CSSTransition>
            )
        }
    </TransitionGroup>;

    {/*let searchControls =
      <div>
        <TextField style={{padding: 24, width:'13%'}}
            id="searchInput"
            placeholder="What are you looking for?"
            margin="normal"
            value={this.state.searchTerm}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
        />
        <Button 
            variant="contained" 
            color="primary" 
            className={classes.button}
            onClick={() => {this.handleSearch()}}
        >
            Load Tweets
        </Button>
      </div>

    let filterControls = <div>
      <a className="btn-floating btn-small waves-effect waves-light pink accent-2" style={controlStyle} onClick={trackTweets}><i className="material-icons">play_arrow</i></a>
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
    </div>*/}

    let loading = <div>
      <p className="flow-text">Listening to Streams</p>
      <div className="progress lime lighten-3">
        <div className="indeterminate pink accent-1"></div>
      </div>
    </div>

    return (
        <Fragment>
            <div className="row">
                {/*<div className="col s12 m4 l4">
                    <div className="input-field col s12">
                        {searchControls}
                        {items.length > 0 ? controls : null}
                    </div>
                </div>*/}
                <div className="col s12 m4 l4">
                    <div>
                        {items.length > 0 ? itemsCards : loading}
                    </div>
                </div>
                <div className="col s12 m4 l4">
                </div>
            </div>
            {
                items.length >= 25 && items.length !== totalList.length? 
                <Link
                    component="button"
                    variant="body2"
                    onClick={() => {this.loadMoreTweets()}}
                    >
                    Load More
                </Link> : null
            }

      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
    notify: state.notify,
    trackTweets: state.trackTweets
});

const controlStyle = {
  marginRight: "5px"
};
export default connect(mapStateToProps, { notify, trackTweets })(withStyles(useStyles)(TweetList));
//export default TweetList;