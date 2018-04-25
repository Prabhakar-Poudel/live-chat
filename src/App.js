import React, { Component } from 'react';
import UserName from './component/user-name';
import './css/app.css';
import ChatWindow from './component/chat-window';
import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App">
					<div className="app-wrapper">
						<Route exact strict path="/" component={UserName} />
						<Route path="/chat" exact strict component={ChatWindow} />
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
