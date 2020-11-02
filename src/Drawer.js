import React, { Component } from 'react';
import Scroll from './Scroll';
import Util from './Util';

class Drawer extends Component {
    constructor(props) {
        super();

        this.refCanvasOrg = React.createRef();
        this.refCanvasShow = React.createRef();
        this.refScroll = React.createRef();

        this.state = {
            width: 200,
            height: 200,
            scale: 1,
            pointerSize: 1,
            color: { r: 255, g: 0, b: 255, a: 1 },
        };
        this.canvasData = null;
        this.drawType = this.pen;

        this.buttonSize = 30;
    };

    componentDidMount = () => {
        const ctx = this.refCanvasOrg.current.getContext('2d');
        this.canvasData = ctx.getImageData(0, 0, this.state.width, this.state.height);
        this.request = window.requestAnimationFrame(this.canvasUpdate);
    }

    componentWillUnmount = () => {
        if (this.request)
            window.cancelAnimationFrame(this.request);
    }

    canvasUpdate = () => {
        if (!this.canvasData || this.state.width <= 0 || this.state.height <= 0) {
            this.request = window.requestAnimationFrame(this.canvasUpdate);
            return;
        }
     
        const ctx = this.refCanvasOrg.current.getContext('2d');
        const ctxShow = this.refCanvasShow.current.getContext('2d');
        ctx.putImageData(this.canvasData, 0, 0);

        ctxShow.clearRect(0, 0, this.state.width * this.state.scale, this.state.height * this.state.scale);
        ctxShow.drawImage(this.refCanvasOrg.current,
            0, 0, this.state.width, this.state.height, 
            0, 0, this.state.width * this.state.scale, this.state.height * this.state.scale);

        this.request = window.requestAnimationFrame(this.canvasUpdate);
    }

    selectPoint = (x, y) => {
        this.drawType.call(this, x, y);
    }

    pen = (x, y) => {
        const mover = (e) => {
            const toLocal = this.toScrollPoint(e.clientX, e.clientY);
            console.log(toLocal);
            this.pixelDraw(toLocal.x, toLocal.y, this.state.color);
        }

        const remover = () => {
            window.removeEventListener('pointermove', mover);
            window.removeEventListener('pointerup', remover);
        }

        window.addEventListener('pointermove', mover);
        window.addEventListener('pointerup', remover);
    }

    pixelDraw = (x, y, rgba) => {
        if (!this.canvasData || x < 0 || x >= this.state.width || y < 0 || y >= this.state.height)
            return;

        const index = (Math.floor(x) + Math.floor(y) * this.state.width) * 4;
        this.canvasData.data[index] = rgba.r;
        this.canvasData.data[index + 1] = rgba.g;
        this.canvasData.data[index + 2] = rgba.b;
        this.canvasData.data[index + 3] = rgba.a;
    }

    pointDraw = (x, y, rgba) => {
        const startX = Math.round(x - (this.state.pointerSize / 2));
        const startY = Math.round(y - (this.state.pointerSize / 2));
        for (var i = 0; i < this.state.pointerSize * this.state.pointerSize; i++) {
            this.pixelDraw(startX + (i % this.state.pointerSize), startY + Math.floor(i / this.state.pointerSize), rgba);
        }
    }

    lineDraw = (x1, y1, x2, y2, rgba) => {
        const count = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        for (var i = 0; i < count; i++) {
            const rate = i / count;
            this.pointDraw(Util.lerp(x1, x2, rate), Util.lerp(y1, y2, rate), rgba);
        };
    }

    onWheel = (e) => { // scale change
        const dir = Math.sign(e.deltaY) * -1;
        this.setState({
            scale: this.state.scale + dir
        });
    }

    toScrollPoint = (clientX, clientY) => {
        if (!this.refScroll.current)
            return { x: clientX, y: clientY };

        return this.refScroll.current.toScrollPoint(clientX, clientY);
    }

    render = () => {
        return <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
            <div id='ButtonArea' style ={{ position: 'absolute', top: 0, width: '100%', height: this.buttonSize, overflow: 'hidden' }}>
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
                <button style={{ width: this.buttonSize, height: this.buttonSize }} />
            </div>
            <div style ={{ position: 'absolute', top: this.buttonSize, bottom: 0, width: '100%' }}>
                <div style ={{ position: 'relative', width: '100%', height: '100%' }} onWheel={this.onWheel}> 
                    <canvas ref={this.refCanvasOrg} style={{ width: this.state.width, height: this.state.height, display: 'none' }} />
                    <Scroll id='ShowArea' ref={this.refScroll} width={this.state.width} height={this.state.height} scale={this.state.scale} selectPoint={this.selectPoint}>
                        <canvas ref={this.refCanvasShow} style={{ width: this.state.width * this.state.scale, height: this.state.height * this.state.scale }} />
                    </Scroll>
                </div>
            </div>
        </div>;
    };
}

export default Drawer;