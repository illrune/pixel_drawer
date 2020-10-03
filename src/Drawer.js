import React, { Component } from 'react';
import Scroll from './Scroll';

class Drawer extends Component {
    constructor(props) {
        super();

        this.refCanvasOrg = React.createRef();
        this.refCanvasShow = React.createRef();
        this.state = {
            width: 200,
            height: 200,
            scale: 1,
        };
        this.buttonSize = 30;
    };

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
                <div style ={{ position: 'relative', width: '100%', height: '100%' }}> 
                    <canvas ref={this.refCanvasOrg} style={{ width: this.state.width, height: this.state.height, display: 'none' }} />
                    <Scroll id='ShowArea' width={this.state.width} height={this.state.height} scale={this.state.scale}>
                        <canvas ref={this.refCanvasShow} style={{ width: this.state.width * this.state.scale, height: this.state.height * this.state.scale }} />
                    </Scroll>
                </div>
            </div>
        </div>;
    };
}

export default Drawer;