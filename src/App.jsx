import React from 'react';
import {Provider} from 'react-redux'
import GameUI from './components/GameUI';
import GameStateStore from './gameState/GameStateStore';

const App = () => {
  return (
    <Provider store={GameStateStore}>
      <div className="app">
        <GameUI />
      </div>
    </Provider>
  );
}

export default App;
