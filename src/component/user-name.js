import React, { Component } from 'react';
import '../css/userName.css';
import { TextField, Button, Paper } from 'material-ui';
import { Link } from 'react-router-dom';
import constants from '../constants';

class UserName extends Component {
  constructor() {
    super();
    this.state = {
      userName: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({
        userName: event.target.value
    });
  }

  handleClick() {
    const { userName } = this.state;
    if (userName.length <= 0 || !userName) {
      return;
    }
    const usersRef = constants.fireStore.collection('users').doc(userName);
    usersRef.set({ name: userName });
  }

  render() {
    const { userName } = this.state;
    return (
      <div className="user-screen">
          <Paper className="user-wrapper">
              <div className="title">
                  <span>Please enter your user name</span>
              </div>
              <div className="user">
                  <TextField value={userName} id="user-name-input" placeholder="User Name" style={{margiBbottom: '5px'}} onChange={this.handleChange} />
                  <Link replace to={{ pathname: "/chat", state: { userName: userName.length > 0 ? userName : null } }}>
                    <Button color="primary" variant="raised" fullWidth onClick={this.handleClick}>Continue</Button>
                  </Link>
              </div>
          </Paper>
      </div>
    );
  }
}

export default UserName;
