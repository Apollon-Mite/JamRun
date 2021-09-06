import React from 'react';
import garbage from 'src/assets/images/garbage.png';
import background from '../../assets/images/background.gif';
import laboratory from '../../assets/images/labo_bg2.jpg';
import './styles.scss';

const Field = () => (
  <div className="field">
    <div className="bg-container">
      <img className="bg background" src={laboratory} alt="" />
      <img className="bg background2" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" />
      {/*<img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" /> */}
      {/* <div className="obstacle obs1" style={{ backgroundImage: `url(${garbage})` }} />
      <div className="obstacle obs2" style={{ backgroundImage: `url(${garbage})` }} /> */}
      <div className="obstacle obs3" style={{ backgroundImage: `url(${garbage})` }} />
    </div>

    {/* <div className="obstacle2" /> */}
  </div>
);

export default Field;
