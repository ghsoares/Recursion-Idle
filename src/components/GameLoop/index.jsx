import Decimal from 'decimal.js';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementVariablePointsAction as addVariablePointsAct } from '../../gameState/Actions';

const GameLoop = () => {
    const gameState = useSelector(state => {
        return {
            variables: state.variables,
            functions: state.functions,
            loopSpeed: state.loopSpeed,
            loopDelta: state.loopDelta
        }
    });

    const gameStateRef = useRef(gameState);
    const prevTime = useRef(Date.now());
    gameStateRef.current = gameState;

    const dispatch = useDispatch();

    const loop = () => {
        const {variables, functions} = gameStateRef.current;
        
        let addPoints = new Decimal(0.0);

        variables.forEach(v => {
            let addProcessed = v;
            functions.forEach(f => {
                addProcessed = f.func(addProcessed, Decimal);
            });
            addPoints = addPoints.add(addProcessed);
        });

        let now = Date.now();
        let dt = now - prevTime.current;
        let lostPercentage = gameStateRef.current.loopDelta / dt;
        addPoints = addPoints.mul(lostPercentage);

        dispatch(addVariablePointsAct(addPoints));
    }

    useEffect(() => {
        const timeoutHandler = () => {
            loop();
            setTimeout(timeoutHandler, gameStateRef.current.loopDelta);
        }
        setTimeout(timeoutHandler, gameStateRef.current.loopDelta);
    }, []);

    return null;
}

export default GameLoop;