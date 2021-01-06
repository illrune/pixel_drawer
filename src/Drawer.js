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
            width: props.width || 200,
            height: props.height || 200,
            scale: 1,
            pointerSize: 3,
            color: { r: 255, g: 0, b: 255, a: 255 },
        };
        this.canvasData = null;
        this.drawType = this.pen;
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

    selectType = (type) => {
        switch (type) {
            case 'pen': this.drawType = this.pen;
                break;
            case 'paint': this.drawType = this.paint;
                break;
            default: this.drawType = this.pen;
        }
    }

    pen = (x, y) => {
        let prev = { x, y };
        this.pointDraw(prev.x, prev.y, this.state.color);

        const mover = (e) => {
            const toLocal = this.toScrollPoint(e.clientX, e.clientY);
            this.lineDraw(prev.x, prev.y, toLocal.x, toLocal.y, this.state.color);
            prev = { x: toLocal.x, y: toLocal.y };
        }

        const remover = () => {
            window.removeEventListener('pointermove', mover);
            window.removeEventListener('pointerup', remover);
        }

        window.addEventListener('pointermove', mover);
        window.addEventListener('pointerup', remover);
    }

    paint = (x, y) => {
        const startIndex = (Math.floor(x) + Math.floor(y) * this.state.width) * 4;
        const startColor = {
            r: this.canvasData.data[startIndex],
            g: this.canvasData.data[startIndex + 1],
            b: this.canvasData.data[startIndex + 2],
            a: this.canvasData.data[startIndex + 3]
        };

        const isSameColor = startColor.r === this.state.color.r 
            && startColor.g === this.state.color.g 
            && startColor.b === this.state.color.b 
            && startColor.a === this.state.color.a;

        if (isSameColor || this.canvasData.data[startIndex] === undefined)
            return;
            
        const dest = [startIndex];
        while(dest.length > 0) {
            const index = dest.shift();
            const oldColor = {
                r: this.canvasData.data[index],
                g: this.canvasData.data[index + 1],
                b: this.canvasData.data[index + 2],
                a: this.canvasData.data[index + 3]
            };

            if (startColor.r !== oldColor.r || startColor.g !== oldColor.g || startColor.b !== oldColor.b || startColor.a !== oldColor.a)
                continue;

            this.canvasData.data[index] = this.state.color.r;
            this.canvasData.data[index + 1] = this.state.color.g;
            this.canvasData.data[index + 2] = this.state.color.b;
            this.canvasData.data[index + 3] = this.state.color.a;

            if (index % (4 * this.state.width) !== 0)
                dest.push(index - 4);   // left
            if (index % (4 * this.state.width) !== 4 * (this.state.width - 1))
                dest.push(index + 4);   // right
            if (index > 4 * (this.state.width - 1))
                dest.push(index - (4 * this.state.width));  // up
            if (index < 4 * this.state.width * (this.state.height - 1))
                dest.push(index + (4 * this.state.width));  // down
        }
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
        if (e.nativeEvent.buttons !== 0)    // no click
            return;

        const dir = Math.sign(e.deltaY) * -1;
        this.setScale(this.state.scale + dir);
    }

    setScale = (scale) => {
        this.setState({
            scale: Util.clamp(scale, 1, 5)
        }, () => {
            // canvas reset
            this.refCanvasShow.current.width = this.state.width * this.state.scale;
            this.refCanvasShow.current.height = this.state.height * this.state.scale;
            const ctx = this.refCanvasShow.current.getContext('2d');
            ctx.imageSmoothingEnabled = false;
        });
    }

    toScrollPoint = (clientX, clientY) => {
        if (!this.refScroll.current)
            return { x: clientX, y: clientY };

        return this.refScroll.current.toScrollPoint(clientX, clientY);
    }

    render = () => {
        return <div style ={{ position: 'relative', width: '100%', height: '100%' }} onWheel={this.onWheel}> 
            <canvas ref={this.refCanvasOrg} width={this.state.width} height={this.state.height} style={{ display: 'none' }} />
            <Scroll id='ShowArea' ref={this.refScroll} width={this.state.width} height={this.state.height} scale={this.state.scale} selectPoint={this.selectPoint}>
                <canvas ref={this.refCanvasShow} width={this.state.width} height={this.state.height} style={{ width: this.state.width * this.state.scale, height: this.state.height * this.state.scale, imageRendering: 'pixelated' }} />
            </Scroll>
        </div>;
    };
}

export default Drawer;