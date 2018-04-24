import React, { Component } from 'react';
import { Icon } from 'material-ui';
import '../css/message.css';
import constants from '../constants';


class Message extends Component {

    getTickIcon(tickType) {
        switch(tickType) {
            case constants.SENT: return <Icon>done</Icon>;
            case constants.RECEIVED: return <Icon>done_all</Icon>;
            case constants.VIEWED: return <Icon style={{color: '#5b5bf5'}}>done_all</Icon>;
            case constants.NEW: return <Icon>schedule</Icon>;
            default: return null;
        }
    }
    render() {
        const { type, content, time, tickType } = this.props;
        let className = type === 'OUT' ? 'sent-message' : 'received-message';
        className += ' message-body-outer';
        return (
            <div className={className}>
                <div className="message-body-inner">
                    <div className="message-text">
                        {content}
                    </div>
                    <div className="message-status">
                        <span className="message-time">
                            {time}
                        </span>
                        {
                            tickType && 
                            <span className="message-tick">
                                {this.getTickIcon(tickType)}
                            </span>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Message;