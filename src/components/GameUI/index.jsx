import React from 'react';
import ShowSpeed from './ShowSpeed';
import ShowVariablePoints from './ShowVariablePoints';
import "../../styles/GameUI.scss";
import FunctionContainer from './FunctionContainer';

const GameUI = () => {
    return (
        <>
            <ShowVariablePoints />
            <ShowSpeed />
            <div className="game-tabs">
                <FunctionContainer className="game-tab functions"/>
                <hr/>
                <FunctionContainer className="game-tab functions"/>
            </div>
        </>
    );
}

export default GameUI;