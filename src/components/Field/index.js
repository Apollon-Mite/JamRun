import React from 'react';

import garbage from 'src/assets/images/trash_can.png';
import miniRobotStop from 'src/assets/images/mini-robot-good.png';
import coin from 'src/assets/images/coin.gif';

// import nightCity from '../../assets/images/background.gif';
import nightCity from '../../assets/images/night_city_combined.gif';
import laboratory from '../../assets/images/labo_bg2.jpg';
import laboStart from '../../assets/images/labo__start.jpg';
import laboEnd from '../../assets/images/labo__end.jpg';
import './styles.scss';

const Field = () => (
  <div className="field">

    {/* <div className="bg-container bg--2">
      <img className="bg labo background3" src={laboStart} alt="" />
      <img className="bg labo background opacity" src={laboEnd} alt="" />
      <img className="bg night-city opacity" src={nightCity} alt="" />
      <img className="bg night-city opacity" src={nightCity} alt="" />
      <img className="bg night-city opacity" src={nightCity} alt="" />
      <img className="bg labo background3 opacity" src={laboStart} alt="" />
      <img className="bg labo background opacity" src={laboratory} alt="" />
      <img className="bg labo background opacity" src={laboEnd} alt="" />
      <img className="bg night-city opacity" src={nightCity} alt="" />
      <img className="bg night-city opacity" src={nightCity} alt="" />
      <img className="bg labo background3" src={laboStart} alt="" />
    </div> */}

    <div className="bg-container bg--1" style={{ left: '0px' }}>
      <img className="bg labo background3" src={laboStart} alt="" />
      {/* <img className="bg labo background2" src={laboratory} alt="" /> */}
      {/* <img className="bg labo background3" src={laboratory} alt="" /> */}
      <img className="bg labo background" src={laboEnd} alt="" />
      <img className="bg night-city crowd" src={nightCity} alt="" />
      <img className="bg night-city" src={nightCity} alt="" />
      <img className="bg night-city" src={nightCity} alt="" />
      <img className="bg labo background3" src={laboStart} alt="" />
      <img className="bg labo background" src={laboratory} alt="" />
      <img className="bg labo background" src={laboEnd} alt="" />
      <img className="bg night-city crowd" src={nightCity} alt="" />
      <img className="bg night-city" src={nightCity} alt="" />
      <img className="bg labo background3" src={laboStart} alt="" />
      {/* <img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" /> */}
      <div className="coin cn1" style={{ backgroundImage: `url(${coin})` }} />
      <div className="coin cn2" style={{ backgroundImage: `url(${coin})` }} />
      <div className="coin cn3" style={{ backgroundImage: `url(${coin})` }} />
      <div className="coin cn4" style={{ backgroundImage: `url(${coin})` }} />
      <div className="coin cn5" style={{ backgroundImage: `url(${coin})` }} />
      <div className="coin cn6" style={{ backgroundImage: `url(${coin})` }} />


      <div className="obstacle obs1 mini-rbt mini-rbt--stop" /* style={{ backgroundImage: `url(${miniRobotStop})` }} */ />
      <div className="obstacle obs2 mini-rbt mini-rbt--stop" /* style={{ backgroundImage: `url(${miniRobotStop})` }} */ />
      <div className="obstacle obs7 mini-rbt mini-rbt--stop" /* style={{ backgroundImage: `url(${miniRobotStop})` }} */ />
      <div className="obstacle obs8 mini-rbt mini-rbt--stop" /* style={{ backgroundImage: `url(${miniRobotStop})` }} */ />
      {/* <div className="obstacle obs2 mini-robot-move-left" style={{ backgroundImage: `url(${miniRobotLeft})` }} /> */}
      <div className="obstacle obs3 garbage" style={{ backgroundImage: `url(${garbage})` }} />
      <div className="obstacle obs5 garbage" style={{ backgroundImage: `url(${garbage})` }} />
      <div className="obstacle obs6 garbage" style={{ backgroundImage: `url(${garbage})` }} />
      <div className="obstacle obs4 mini-rbt mini-rbt--stop" /* style={{ backgroundImage: `url(${miniRobotStop})` }} */ />
    </div>

    {/* deuxième partie */}

    {/* <div className="obstacle2" /> */}
  </div>
);

export default Field;
