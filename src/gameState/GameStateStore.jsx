import {createStore} from 'redux';
import Decimal from 'decimal.js'

const INITIAL_GAME_STATE = {
    variablePoints: new Decimal(0),
    loopSpeed: new Decimal(1.0),
    loopDelta: new Decimal(1000.0),
    variables: [
        new Decimal(0.0),
    ],
    functions: [{
        name: "myFunction1",
        func: function(x, Decimal) {
            return x.add(new Decimal(1.0));
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
            const loopSpeed = state.loopSpeed.add(action.payload.amount);
            let loopDelta;

            if (loopSpeed.gt(new Decimal(10000.0))) {
                loopDelta = new Decimal(0.0);
            } else {
                loopDelta = new Decimal(1000.0).div(loopSpeed);
            }

            return {
                ...state,
                loopSpeed,
                loopDelta
            }
        default:
            return state;
    }
}

const GameStateStore = createStore(gameStateReducer);

export default GameStateStore;