import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import FunctionError from './FunctionError';

const FunctionErrorsContainer = ({func}) => {
    const {
        setGameState
    } = useContext(GameContext);
    const {errors} = func.precompiledState;
    if (errors.length === 0) {
        return null;
    }

    const closeCurrentError = () => {
        const {functionName} = func;
        func["precompiledState"]["errors"].shift();
        setGameState(prevGameState => {
            prevGameState.functions[functionName] = func;
            return prevGameState;
        });
    }

    let currentError = errors[0];

    return (
        <div className="errors-container">
            <div className="error-top">
                <h3>Compilation Errors:</h3>
                <button onClick={closeCurrentError}>Close</button>
            </div>
            <FunctionError error={currentError}/>
        </div>
    );
}

export default FunctionErrorsContainer;