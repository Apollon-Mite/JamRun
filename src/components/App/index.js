// == Import npm
import React from 'react';

// == Import
import Robot from '../Robot';
import Field from '../Field';

import './styles.scss';

// == Composant
const App = () => (
  <div className="app">
    <div className="game-container">
      <Robot />
      <Field />
    </div>
  </div>
);

// == Export
export default App;
