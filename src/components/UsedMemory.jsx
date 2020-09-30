import Decimal from 'decimal.js';
import React from 'react';
import {interpolateRgbBasis} from 'd3-interpolate';

/*
>span.status-green {
        color: rgb(142, 255, 208);
    }
    >span.status-yellow {
        color: rgb(253, 255, 142);
    }
    >span.status-red {
        color: rgb(255, 142, 161);
    }
*/

const UsedMemory = ({memory, usedMemory}) => {
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