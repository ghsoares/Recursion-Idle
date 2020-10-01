import React, {} from 'react';
import { useSelector } from 'react-redux';

const GameUI = () => {
    const variablePoints = useSelector(state => state.variablePoints);

    return (
        <h1>{variablePoints.toString()}</h1>
    );
}

export default GameUI;