// == Import npm
import React from 'react';

// == Import
import Robot from '../Robot';
import Field from '../Field';

import background from '../../assets/images/background.gif'
import './styles.css';

// == Composant
const App = () => (
  <div className="app">
    <img className="background" src={background} />
    <Robot />
    <Field />
  </div>
);

// == Export
export default App;
