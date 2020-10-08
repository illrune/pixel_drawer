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
            drawType: this.pen,
            pointerSize: 1,

        };
        this.canvasData = null;

        this.buttonSize = 30;
    };

    componentDidMount = () => {
        const ctx = this.refCanvasOrg.current.getContext('2d');
        this.canvasData = ctx.getImageData(0, 0, this.state.width, this.state.height);
    }

    selectPoint = (x, y) => {

    }

    pen = (x, y) => {

    }

    pixelDraw(x, y, rgba) {
        if (!this.canvasData || x < 0 || x >= this.state.width || y < 0 || y >= this.state.height)
            return;

        const index = (Math.floor(x) + Math.floor(y) * this.state.width) * 4;
        this.canvasData.data[index] = rgba.r;
        this.canvasData.data[index + 1] = rgba.g;
        this.canvasData.data[index + 2] = rgba.b;
        this.canvasData.data[index + 3] = rgba.a;
    }

    pointDraw(x, y, rgba) {
        const startX = Math.round(x - (this.state.pointerSize / 2));
        const startY = Math.round(y - (this.state.pointerSize / 2));
        for (var i = 0; i < this.state.pointerSize * this.state.pointerSize; i++) {
            this.pixelDraw(startX + (i % this.state.pointerSize), startY + Math.floor(i / this.state.pointerSize), rgba);
        }
    }

    lineDraw(x1, y1, x2, y2, rgba) {
        const count = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        for (var i = 0; i < count; i++) {
            const rate = i / count;
            this.pointDraw(this.lerp(x1, x2, rate), this.lerp(y1, y2, rate), rgba);
        };
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
                <div style ={{ position: 'relative', width: '100%', height: '100%' }}> 
                    <canvas ref={this.refCanvasOrg} style={{ width: this.state.width, height: this.state.height, display: 'none' }} />
                    <Scroll id='ShowArea' width={this.state.width} height={this.state.height} scale={this.state.scale} selectPoint={this.pointerEvent}>
                        <canvas ref={this.refCanvasShow} style={{ width: this.state.width * this.state.scale, height: this.state.height * this.state.scale }} />
                    </Scroll>
                </div>
            </div>
        </div>;
    };
}

export default Drawer;