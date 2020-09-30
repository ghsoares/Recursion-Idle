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
        addVariablePoints,
        addLoopSpeed
    } = useContext(GameContext);

    const gameStateRef = useRef({
        gameState,
        addVariablePoints,
        addLoopSpeed
    });

    gameStateRef.current = {
        gameState,
        addVariablePoints,
        addLoopSpeed
    };

    let prevTime = Date.now();

    const loop = () => {
        const {functions, startVariable} = gameStateRef.current.gameState;

        let currentTime = Date.now();
        let delta = new Decimal(currentTime - prevTime);

        let add = startVariable;

        Object.keys(functions).reverse().forEach(name => {
            let f = functions[name]["compiled"];
            add = f(add, Decimal);
        });

        let dt = new Decimal(1000.0).div(gameStateRef.current.gameState.loopSpeed);
        let lostPercentage = delta.div(dt);

        addVariablePoints(add.mul(lostPercentage));
        setTimeout(() => loop(), dt);

        prevTime = currentTime;
    }

    useEffect(() => {
        setTimeout(() => loop(), 1000.0 / gameState.loopSpeed);
    }, []);

    return null;
}

export default GameLoop;