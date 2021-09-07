import React from 'react';
import garbage from 'src/assets/images/garbage.png';
// import nightCity from '../../assets/images/background.gif';
import nightCity from '../../assets/images/night_city_combined.gif';
import laboratory from '../../assets/images/labo_bg2.jpg';
import laboStart from '../../assets/images/labo_bg_start.jpg';
import laboEnd from '../../assets/images/labo_bg_end.jpg';
import './styles.scss';

const Field = () => (
  <div className="field">
    <div className="bg-container">
      <img className="bg labo background" src={laboratory} alt="" />
      {/* <img className="bg labo background2" src={laboratory} alt="" /> */}
      {/* <img className="bg labo background3" src={laboratory} alt="" /> */}
      <img className="bg labo background" src={laboEnd} alt="" />
      <img className="bg night-city" src={nightCity} alt="" />
      <img className="bg night-city" src={nightCity} alt="" />
      <img className="bg night-city" src={nightCity} alt="" />
      <img className="bg labo background3" src={laboStart} alt="" />
      <img className="bg labo background" src={laboratory} alt="" />
      <img className="bg labo background" src={laboEnd} alt="" />
      <img className="bg night-city" src={nightCity} alt="" />
      <img className="bg night-city" src={nightCity} alt="" />
      {/*<img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" />
      <img className="bg background3" src={laboratory} alt="" /> */}
      <div className="obstacle obs1 garbage" style={{ backgroundImage: `url(${garbage})` }} />
      <div className="obstacle obs2 garbage" style={{ backgroundImage: `url(${garbage})` }} />
      <div className="obstacle obs3 garbage" style={{ backgroundImage: `url(${garbage})` }} />
    </div>

    {/* <div className="obstacle2" /> */}
  </div>
);

export default Field;
