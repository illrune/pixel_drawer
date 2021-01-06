import React from 'react';

import Drawer from './Drawer';
import Button from './IconButton';

import IconPen from './Icons/pen.png';
// import IconPaint from './Icons/paint.png';

function App() {
  const refDrawer = React.createRef();
  const buttonSize = 30;

  return (
    <div id='Sample' style={{ position: 'relative', margin: 'auto', width: 600, height: 600 }}>
      <div id='ButtonArea' style ={{ width: '100%', height: buttonSize, overflow: 'hidden' }}>
          <Button size={buttonSize} src={IconPen} event={() => { refDrawer.current.selectType('pen'); }} />
          <Button size={buttonSize} src={IconPen} event={() => { refDrawer.current.selectType('paint'); }} />
          <Button size={buttonSize} src={IconPen} event={null} />
          <Button size={buttonSize} src={IconPen} event={null} />
          <Button size={buttonSize} src={IconPen} event={null} />
      </div>
      <Drawer ref={refDrawer} width={500} height={500}/>
    </div>
  );
}

export default App;
