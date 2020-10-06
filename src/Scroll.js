import React, { Component } from 'react';

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
        if (e.button === 0)
            return;
        if (e.button === 2)
            this.useScroll();
    }

    useScroll = () => {
        const maxLeft = this.refScrollArea.current.clientWidth - this.props.width - 1;
        const maxTop = this.refScrollArea.current.clientHeight- this.props.height - 1;

        const mover = (e) => {
            const left = Math.min(Math.max(this.state.left + e.movementX, 0), maxLeft);
            const top = Math.min(Math.max(this.state.top + e.movementY, 0), maxTop);

            this.setState({ left: left, top: top });
        }

        const remover = () => {
            this.refScrollArea.current.removeEventListener('pointermove', mover);
            window.removeEventListener('pointerup', remover);
        }

        this.refScrollArea.current.addEventListener('pointermove', mover);
        window.addEventListener('pointerup', remover);
    }

    render() {
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