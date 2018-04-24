import React, { Component } from 'react';
import '../css/chatWindow.css';
import LeftPane from './left-pane';
import RightPane from './right-pane';
import { Redirect } from 'react-router-dom';
import constants from '../constants';


class ChatWindow extends Component {

    constructor() {
        super();
        this.state = {
            selectedUser: null,
            loggedInUser: null,
            messages: [],
        }

        this.userSelected = this.userSelected.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.mergeNewAndUpdatedMessages = this.mergeNewAndUpdatedMessages.bind(this);
        this.clearUserListeners = this.clearUserListeners.bind(this);
        this.clearConversationListeners = this.clearConversationListeners.bind(this);
        this.listenToNewMessages = this.listenToNewMessages.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (typeof nextProps.location.state === 'object') {
            return { loggedInUser: nextProps.location.state.userName};
        }
    }

    componentWillUnmount() {
        this.clearUserListeners();
        this.clearConversationListeners();
    }

    componentDidMount() {
        this.listenToNewMessages(this.state.loggedInUser)
    }

    componentDidUpdate() {
        this.listenToNewMessages(this.state.loggedInUser)
    }

    listenToNewMessages(loggedInUser) {
        this.clearUserListeners();
        if (!loggedInUser || typeof loggedInUser !== 'string' || loggedInUser.length < 1 || this.listen) return;
        const messagesRef = constants.fireStore.collection('messages');
        this.listen = true;
        this.sendMessagesRef = messagesRef.where('receiver', '==', loggedInUser).onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                const data = doc.data()
                console.log('calleg global listener', data);
                if (data.deliveryStatus === constants.SENT || data.deliveryStatus === constants.NEW) {
                    messagesRef.doc(doc.id).set({ deliveryStatus: constants.RECEIVED }, { merge: true })
                }
            });
        });
    }


    clearUserListeners() {
        if (typeof this.allNewMessages === 'function') {
            this.allNewMessages();
        }
    }

    clearConversationListeners() {
        if (typeof this.sendMessagesRef === 'function') {
            this.sendMessagesRef();
        }
        if (typeof this.receivedMessagesRef === 'function') {
            this.receivedMessagesRef();
        }
    }

    updateMessages(selectedUser) {
        const messagesRef = constants.fireStore.collection('messages');
        const { loggedInUser } = this.state;
        this.clearConversationListeners();
        this.setState({ messages: [] });
        this.sendMessagesRef = messagesRef.where('sender', '==', loggedInUser).where('receiver', '==', selectedUser).onSnapshot(messageSent => (this.mergeNewAndUpdatedMessages(messageSent, messagesRef)));
        this.receivedMessagesRef = messagesRef.where('receiver', '==', loggedInUser).where('sender', '==', selectedUser).onSnapshot(messageReceived => (this.mergeNewAndUpdatedMessages(messageReceived, messagesRef)));
    }

    mergeNewAndUpdatedMessages(messageChangeSet, messagesRef) {
        const { messages } = this.state;
        messageChangeSet.docChanges.forEach(message => {
            if (message.type === 'added') {
                const messageData = message.doc.data();
                messageData.id = message.doc.id;
                messages.push(messageData);

                // set received flag
                if (messageData.deliveryStatus === constants.SENT) {
                    console.log('called at new', message.doc.data());
                    messagesRef.doc(message.doc.id).set({ deliveryStatus: constants.RECEIVED }, { merge: true })
                }
            }
            if (message.type === 'modified') {
                const index = messages.findIndex(e => {
                    return e.id === message.doc.id;
                })
                console.log('called at modified', messages[index], message.doc.data());
                if (index >= 0) {
                    const updatedData = message.doc.data();
                    updatedData.id = message.doc.id;
                    messages.splice(index, 1, updatedData);
                }
            }
        })
      this.setState({ messages })
    }

    userSelected(user) {
        if (user !== this.state.selectedUser) {
            this.setState({ selectedUser: user });
            this.updateMessages(user);
        }
    }
    
  render() {
    const { loggedInUser, selectedUser, messages } = this.state;
    return (
        typeof loggedInUser === 'string' && loggedInUser.length > 0 ?
        (<div className="chat-window-wrapper">
                <LeftPane userName={loggedInUser} currentSelected={selectedUser} className="left-pane" userSelected={this.userSelected}></LeftPane>
                <RightPane userName={loggedInUser} currentSelected={selectedUser} messages={messages} className="right-pane"></RightPane>
        </div>)
        :
        (<Redirect to="/" exact strict/>)
    );
  }
}

export default ChatWindow;
