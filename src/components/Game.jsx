import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import FunctionsContainer from './FunctionsContainer';
import GameLoop from './GameLoop';
import ShopContainer from './ShopContainer';
import '../styles/Game.scss';
import BigNumber from 'bignumber.js';
import { edp } from '../extensionMethods/DecimalNumberExtensions';
import Decimal from 'decimal.js';
import UsedMemory from './UsedMemory';

const Game = () => {
    const {
        gameState: {
            variablePoints,
            loopSpeed,
            memory,
            usedMemory
        },
    } = useContext(GameContext);

    return (
        <div className="game">
            <GameLoop />
            <h1 className="variable-points-display">
                Variable Points: <span>{variablePoints.toDP(1).toString()}</span>
            </h1>
            <h3 className="loop-speed-display">
                Loop Speed: <span>{loopSpeed.mul(100).toDP(1).toString()}%</span>
            </h3>
            <UsedMemory
                memory={memory}
                usedMemory={usedMemory}
            />

            <div className="center-tabs">
                <FunctionsContainer></FunctionsContainer>
                <hr/>
                <ShopContainer></ShopContainer>
            </div>
        </div>
    );
}

export default Game;