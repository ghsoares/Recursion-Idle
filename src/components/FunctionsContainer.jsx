import React, {} from 'react';
import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import FunctionItem from './FunctionItem';

const FunctionsContainer = () => {
    const {
        gameState: {functions}
    } = useContext(GameContext);

    let functionsBodies = [];

    functionsBodies = Object.keys(functions).map((k, idx) => {
        let name = k;
        return <FunctionItem key={idx} functionName={name} function={functions[k]}/>
    });

    return (
        <div>
            <h2 className="tab-title">Functions</h2>
            <div className="functions-list">
                {functionsBodies}
            </div>
        </div>
    );
}

export default FunctionsContainer;