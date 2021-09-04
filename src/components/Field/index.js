import React from 'react';
import garbage from 'src/assets/images/garbage.png';

import './styles.scss';

const Field = () => (
  <div className="field">
    <div className="obstacle" style={{ backgroundImage: `url(${garbage})` }} />
    {/* <div className="obstacle2" /> */}
  </div>
);

export default Field;
