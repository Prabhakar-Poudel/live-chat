import React, { Component } from 'react';
import '../css/sendMessage.css';
import {  Icon, TextField } from 'material-ui';
import PropTypes from 'prop-types';

class SendMessage extends Component {

	constructor() {
		super();
		this.state = {
			inputValue: '',
			showSend: false
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const showSend = event.target.textLength > 0;
		this.setState({
			inputValue: event.target.value,
			showSend
		});
	}

	handleClick() {
		this.props.sendNewMessage(this.state.inputValue);
		this.setState({
			inputValue: '',
			showSend: false
		});
	}
	render() {
		return  (
			<div className="message-send-wrapper">
				<div className="text-field-wrapper">
					<TextField className="text-field"
						placeholder="Type a message"
						multiline
						autoFocus
						InputProps={{
							disableUnderline:   true,
						}}
						rowsMax="4"
						onChange={this.handleChange}
						value={this.state.inputValue}
					/>
				</div>
				{ this.state.showSend &&
				<div type='submit' className="send-button-wrapper">
					<Icon onClick={this.handleClick}>send</Icon>
				</div>
				}
			</div>
		);
	}
}

export default SendMessage;

SendMessage.propTypes = {
	sendNewMessage: PropTypes.func.isRequired,
};
