import {createStore} from 'redux';
import Decimal from 'decimal.js'

const INITIAL_GAME_STATE = {
    variablePoints: new Decimal(0.0)
};

function gameStateReducer(state = INITIAL_GAME_STATE, action) {
    switch (action.type) {
        case "variablePoints/add":
            return {
                ...state,
                variablePoints: state.variablePoints.add(action.payload.amount)
            }
            break;
        default:
            return state;
    }
}

const GameStateStore = createStore(gameStateReducer);

export default GameStateStore;