import BigNumber from 'bignumber.js';
import {Decimal} from 'decimal.js';
import { useContext, useEffect, useRef } from 'react';
import { GameContext } from '../contexts/GameContext';

/*
This component will run the main loop, will keep running while the game tab is running,
regardless of route, tab is the current (will calculate frame with delta), etc.
*/

const GameLoop = () => {
    const {
        gameState,
        setGameState
    } = useContext(GameContext);

    const gameStateRef = useRef(gameState);

    gameStateRef.current = gameState;

    let prevTime = Date.now();

    const loop = () => {
        const {functions, startVariable, loopSpeed} = gameStateRef.current;

        let currentTime = Date.now();
        let delta = new Decimal(currentTime - prevTime);

        let add = startVariable;

        Object.keys(functions).reverse().forEach(name => {
            let f = functions[name]["compiledState"]["function"];
            add = f(add, Decimal);
        });

        let dt = new Decimal(1000.0).div(loopSpeed);
        let lostPercentage = delta.div(dt);
        let total = add.mul(lostPercentage);

        setGameState(prevGameState => ({
            ...prevGameState,
            variablePoints: prevGameState.variablePoints.add(total)
        }));
        setTimeout(() => loop(), dt);

        prevTime = currentTime;
    }

    useEffect(() => {
        setTimeout(() => loop(), 1000.0 / gameState.loopSpeed);
    }, []);

    return null;
}

export default GameLoop;