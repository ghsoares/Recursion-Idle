import React from "react";
import { Provider } from "react-redux";
import GameUI from "./components/GameUI";
import GameLoop from "./components/GameLoop";
import "./config/ConfigDecimal";
import GameStateStore from "./game state/GameStateStore";

const App = () => {
  return (
    <Provider store={GameStateStore}>
      <GameLoop />
      <div className="app">
        <GameUI />
      </div>
    </Provider>
  );
};

export default App;
