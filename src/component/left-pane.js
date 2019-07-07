import React, { Component } from 'react';
import '../css/leftPane.css';
import {
	Avatar,
	Divider,
	Icon,
	List,
	ListItem,
	ListItemText
} from '@material-ui/core';
import constants from '../constants';
import PropTypes from 'prop-types';

class LeftPane extends Component {
	constructor() {
		super();
		this.state = {
			userList: [],
			searchString: ''
		};
		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
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

	handleSearchChange(e) {
		const searchString = e.target.value;
		this.setState({ searchString });
	}

	clearSearch() {
		if (this.state.searchString !== '') this.setState({ searchString: '' });
	}

	render() {
		const { userList, searchString } = this.state;
		const { currentSelected, userSelected } = this.props;

		const isSearchedUser = user =>
			searchString === '' ||
			user.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;

		return (
			<div className={this.props.className}>
				<div className="user-list-container">
					<div className="user-search-wrapper">
						<div className="user-search">
							<input
								placeholder="Search User"
								id="user-search-input"
								value={searchString}
								onChange={this.handleSearchChange}
							/>
							<button className="user-search-button" onClick={this.clearSearch}>
								<Icon>
									{ searchString === ''
										? 'search'
										: 'close' }
								</Icon>
							</button>
						</div>
					</div>

					<List className="user-list">
						{userList.reduce((acc, user, index) => {
							const className = user === currentSelected ? 'active' : null;

							if (isSearchedUser(user)) {
								acc.push(
									<div key={`${index}-${user}`} onClick={() => userSelected(user)}>
										<ListItem dense button className={className}>
											<Avatar>
												<Icon>person</Icon>
											</Avatar>
											<ListItemText primary={user} className="username" />
										</ListItem>
										<Divider />
									</div>
								);
							}
							return acc;
						}, [])}
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
	userSelected: PropTypes.func.isRequired
};
