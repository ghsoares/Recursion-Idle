import { createStore } from "redux";
import Decimal from "decimal.js";
import { composeWithDevTools } from "redux-devtools-extension";

const INITIAL_GAME_STATE = {
  variablePoints: new Decimal(0),
  operationsPerSecond: new Decimal(1.0),
  get loopDelta() {
    return new Decimal(1000.0).div(this.operationsPerSecond);
  },
  variables: [new Decimal(1.0)],
  functions: [
    {
      name: "myFunction1",
      sourceCode: "return x * 1;",
      virtualMemory: new Decimal(1.0),
      func: function (x, Decimal) {
        return x.mul(new Decimal(1.0));
      },
    },
  ],
  shop: {
    items: {
      opPerSec: {
        label: (qtd) => `Increase OPs/Sec by ${new Decimal(0.1).mul(qtd)}`,
        currency: "variablePoints",
        initialPrice: new Decimal(250),
        currentPrice: new Decimal(250),
        priceIncrease: (prevPrice) => prevPrice.mul(1.1),
        onPurchase: (prevState) => ({
          ...prevState,
          operationsPerSecond: prevState.operationsPerSecond.add(0.1)
        }),
      },
    },
  },
};

function gameStateReducer(state = INITIAL_GAME_STATE, action) {
  switch (action.type) {
    case "variablePoints/increment":
      state.variablePoints = state.variablePoints.add(action.payload.amount);

      break;
    case "loopSpeed/increment":
      const operationsPerSecond = state.operationsPerSecond.add(
        action.payload.amount
      );

      state.operationsPerSecond = operationsPerSecond;

      break;
    case "shopPurchase":
      const shopItem = state.shop.items[action.payload.itemName];
      let currentCurrency = state[shopItem.currency];
      
      let totalPrice = shopItem.currentPrice;
      let currentI = action.payload.qtd;

      while ((currentI -= 1) > 0) {
        totalPrice = shopItem.priceIncrease(totalPrice);
      }
      
      currentCurrency = currentCurrency.minus(totalPrice);

      totalPrice = shopItem.priceIncrease(totalPrice);

      shopItem.currentPrice = totalPrice;

      state = shopItem.onPurchase(state);
      state[shopItem.currency] = currentCurrency;
      state.shop.items[action.payload.itemName] = shopItem;
      
      break;
    default:
      break;
  }
  Object.defineProperty(state, "loopDelta", {
    get: function() {
      return new Decimal(1000.0).div(this.operationsPerSecond);
    }
  });
  //state.loopDelta.bind(state);
  return state;
}

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
});

const GameStateStore = createStore(gameStateReducer, composeEnhancers());

export default GameStateStore;
