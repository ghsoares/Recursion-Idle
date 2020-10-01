import React from 'react';
import {Provider} from 'react-redux'
import GameUI from './components/GameUI';
import GameStateStore from './gameState/GameStateStore';
import './config/ConfigDecimal';
import GameLoop from './components/GameLoop';

const App = () => {
  return (
    <Provider store={GameStateStore}>
      <GameLoop />
      <div className="app">
        <GameUI />
      </div>
    </Provider>
  );
}

export default App;
