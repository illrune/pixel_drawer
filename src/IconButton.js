import React, { Component } from 'react';

class IconButton extends Component {
    render = () => {
        return <button style={{ width: this.props.size, height: this.props.size, padding: 0 }} onClick={this.props.event}>
            <img src={this.props.src} alt='' style={{ width: this.props.size, height: this.props.size }} />
        </button>
    };
}

export default IconButton;