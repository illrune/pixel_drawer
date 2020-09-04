import React, { Component } from 'react';

class Drawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 200,
            height: 200,
        };
        this.buttonSize = 30;
    }

    render() {
        return <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
            <div id='ButtonArea' style ={{ position: 'absolute', top: 0, width: '100%', height: this.buttonSize, overflow: 'hidden' }}>
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
            </div>
            <div style ={{ position: 'absolute', top: this.buttonSize, bottom: 0, width: '100%' }}>
                <canvas style={{ width: this.state.width, height: this.state.height }} />
            </div>
        </div>;
    }
}

export default Drawer;