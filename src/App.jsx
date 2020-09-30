import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';
import React from 'react';
import Game from './components/Game';
import GameProvider from './contexts/GameContext';

Decimal.prototype.neq = function (n = new BigNumber()) {
  return !this.eq(n);
};

const App = () => {
  return (
    <GameProvider>
      <Game></Game>
    </GameProvider>
  );
}


export default App;
