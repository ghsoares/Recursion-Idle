import {createStore} from 'redux';
import Decimal from 'decimal.js'
import {composeWithDevTools} from 'redux-devtools-extension';

const INITIAL_GAME_STATE = {
    variablePoints: new Decimal(0),
    operationsPerSecond: new Decimal(1.0),
    loopDelta: new Decimal(1000.0),
    variables: [
        new Decimal(1.0),
    ],
    functions: [{
        name: "myFunction1",
        sourceCode: "return x * 1;",
        virtualMemory: new Decimal(1.0),
        func: function(x, Decimal) {
            return x.mul(new Decimal(1.0));
        }
    }],
};

function gameStateReducer(state = INITIAL_GAME_STATE, action) {
    switch (action.type) {
        case "variablePoints/increment":
            return {
                ...state,
                variablePoints: state.variablePoints.add(action.payload.amount)
            }
        case "loopSpeed/increment":
            const operationsPerSecond = state.operationsPerSecond.add(action.payload.amount);
            let loopDelta;

            if (operationsPerSecond.gt(new Decimal(10000.0))) {
                loopDelta = new Decimal(0.0);
            } else {
                loopDelta = new Decimal(1000.0).div(operationsPerSecond);
            }

            return {
                ...state,
                operationsPerSecond,
                loopDelta
            }
        default:
            return state;
    }
}

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 25,
});

const GameStateStore = createStore(gameStateReducer, composeEnhancers());

export default GameStateStore;