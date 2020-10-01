import Decimal from 'decimal.js';
import React, { useContext } from 'react';
import {interpolateRgbBasis} from 'd3-interpolate';
import { GameContext } from '../contexts/GameContext';

const UsedMemory = () => {
    const {
        gameState: {
            memory
        },
        helperFunctions: {
            calculateUsedMemory
        }
    } = useContext(GameContext);

    let usedMemory = calculateUsedMemory();

    let percentage = usedMemory.div(memory).toNumber();

    let colorInterpolation = interpolateRgbBasis([
        "rgb(81, 255, 96)",
        "rgb(255, 238, 81)",
        "rgb(255, 81, 81)"
    ]);

    let color = colorInterpolation(percentage);

    return (
        <h3 className="memory-display">
            PC's Memory: <span style={{
                "--color": color,
                "--stop": `${percentage * 100.0}%`
            }}>{usedMemory.toString()}Kb / {memory.toString()}Kb</span>
        </h3>
    );
}

export default UsedMemory;