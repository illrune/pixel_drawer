import React, { Component } from 'react';

import Util from './Util';

class Scroll extends Component {
    constructor(props) {
        super();

        this.refScrollArea = React.createRef();
        this.state = {
            left: 0,
            top: 0,
        };
    };

    pointerDown = (e) => {
        if (e.button === 0) {
            if (this.props.selectPoint)
                this.props.selectPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        } else if (e.button === 2) {
            this.useScroll();
        }
    }

    useScroll = () => {
        const minLeft = Math.min(this.refScrollArea.current.clientWidth - (this.props.width * this.props.scale) - 2, 0);
        const maxLeft = Math.max(this.refScrollArea.current.clientWidth - (this.props.width * this.props.scale) - 2, 0);
        const maxTop = Math.max(this.refScrollArea.current.clientHeight - (this.props.height * this.props.scale) - 2, 0);
        const minTop = Math.min(this.refScrollArea.current.clientHeight - (this.props.height * this.props.scale) - 2, 0);

        const mover = (e) => {
            const left = Util.clamp(this.state.left + e.movementX, minLeft, maxLeft);
            const top = Util.clamp(this.state.top + e.movementY, minTop, maxTop);

            this.setState({ left: left, top: top });
        }

        const remover = () => {
            window.removeEventListener('pointermove', mover);
            window.removeEventListener('pointerup', remover);
        }

        window.addEventListener('pointermove', mover);
        window.addEventListener('pointerup', remover);
    }

    toScrollPoint = (globalX, globalY) => { // use client XY
        const rect = this.refScrollArea.current.getClientRects();
        const localX = globalX - rect[0].left - this.state.left;
        const localY = globalY - rect[0].top - this.state.top;

        return { x: localX, y: localY };
    }

    render = () => {
        const width = this.props.width * this.props.scale;
        const height = this.props.height * this.props.scale;

        return <div ref={this.refScrollArea} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', userSelect: 'none' }} 
                onPointerDown={this.pointerDown} onContextMenu={(e) => { e.preventDefault(); }}>
            <div style={{ position: 'absolute', width: width, height: height, left: this.state.left, top: this.state.top, border: '1px solid black' }}>
                { this.props.children }
            </div>
        </div>;
    };
}

export default Scroll;