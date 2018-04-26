import React, { Component } from 'react';
import '../css/leftPane.css';
import { Avatar, Divider, Icon, List, ListItem, ListItemText } from 'material-ui';
import constants from '../constants';
import PropTypes from 'prop-types';


class LeftPane extends Component {
	constructor() {
		super();
		this.state = {
			userList: []
		};
	}
	componentDidMount() {
		const usersRef = constants.fireStore.collection('users');
		let userList = [];
		usersRef.onSnapshot(users => {
			users.forEach(doc => {
				const user = doc.data();
				const { name } = user;
				if (name !== this.props.userName) {
					userList.push(name);
				}
			});
			this.setState({ userList });
			userList = [];
		});
	}
	render() {
		return (
			<div className={this.props.className}>
				<div className="user-list-container">
					<div className="user-search-wrapper">
						<div className="user-search">
							<input placeholder="Search User" id="user-search-input" />
							<button className="user-search-button">
								<Icon>search</Icon>
							</button>
						</div>
					</div>
            
					<List className="user-list">
						{this.state.userList.map((user, index) => {
							const className = user === this.props.currentSelected ? 'active' : null;
							return (
								<div  key={index} onClick={() => (this.props.userSelected(user))}>
									<ListItem dense button className={className}>
										<Avatar><Icon>person</Icon></Avatar>
										<ListItemText  primary={user} />
									</ListItem>
									<Divider />
								</div>
							);
						})}
					</List>
				</div>
			</div>
		);
	}
}

export default LeftPane;

LeftPane.propTypes = {
	userName: PropTypes.string.isRequired,
	className: PropTypes.string,
	currentSelected: PropTypes.string,
	userSelected: PropTypes.func.isRequired,
};
