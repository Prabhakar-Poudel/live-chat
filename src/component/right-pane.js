import React, { Component } from 'react';
import '../css/rightPane.css';
import { Icon } from 'material-ui';
import moment from 'moment';
import Message from './message';
import SendMessage from './send-message';
import constants from '../constants';


const OUT = 'OUT';
const IN = 'IN';
class RightPane extends Component {

  constructor() {
    super();
    this.state = {
      messages: [],
    }
    this.sendNewMessage = this.sendNewMessage.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { messages: nextProps.messages.sort((a, b) => {
      return a.dateTime > b.dateTime ? 1 : a.dateTime === b.dateTime ? 0 : -1;
    })
  };
  }

  setScroll() {
    const node = document.getElementsByClassName('chat-body')[0];
    node.scrollTop = node.scrollHeight;
  }

  updateReceivedMessages(messages, user) {
    const messagesRef = constants.fireStore.collection('messages');
    const messageToUpdate = messages.filter(message => (message.receiver === user && message.deliveryStatus !== constants.VIEWED))
    messageToUpdate.map(message => messagesRef.doc(message.id).set({ deliveryStatus: constants.VIEWED }, { merge: true }));
  }

  componentDidUpdate() {
    this.setScroll();
    this.updateReceivedMessages(this.state.messages, this.props.userName);
  }

  sendNewMessage(message) {
      const messagesRef = constants.fireStore.collection('messages');
      messagesRef.add(
        {
          content: message,
          sender: this.props.userName,
          receiver: this.props.currentSelected,
          dateTime: moment().toISOString(),
          deliveryStatus: constants.NEW
        }
      ).then(sentMessage => {
        messagesRef.doc(sentMessage.id).set({ deliveryStatus: constants.SENT }, { merge: true });
      })
  };

  render() {
    const userName = this.props.userName;
    this.receiverName = this.props.currentSelected;
    const { messages } = this.state;
    return (
      <div className={this.props.className}>
          { this.props.currentSelected && 
            <div className="chat-section">
              <div className="chat-header">
                <Icon className="top-avatar">account_circle</Icon>
                <span>{this.props.currentSelected}</span>
              </div>
              <div className="chat-body">
                <div className="chat-content">
                {
                  messages.map((message, index) => {
                  const type = userName === message.sender ? OUT : IN;
                  const { content } = message;
                  const time = moment(message.dateTime).format('HH:mm');
                  const tickType = type === OUT ? message.deliveryStatus : null;
                  return <Message key={index} type={type} content={content} time={time} tickType={tickType} />
                  })
                }
                </div>
              </div>
              <div className="chat-footer">
                  <SendMessage sendNewMessage={this.sendNewMessage}/>
              </div>
            </div>
          }
          {
            !this.props.currentSelected &&
            <div className="empty-right-pane">
              <div className="empty-message">
                 Select a user to start conversation!
              </div>
            </div>
          }
      </div>
    );
  };
}

export default RightPane;
