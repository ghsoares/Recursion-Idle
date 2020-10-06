import React from 'react';
import ShowSpeed from './ShowSpeed';
import ShowVariablePoints from './ShowVariablePoints';
import "../../styles/GameUI.scss";
import FunctionContainer from './FunctionContainer';
import ShopContainer from './ShopContainer';

const GameUI = () => {
    return (
        <>
            <ShowVariablePoints />
            <ShowSpeed />
            <div className="game-tabs">
                <FunctionContainer/>
                <hr/>
                <ShopContainer/>
            </div>
        </>
    );
}

export default GameUI;