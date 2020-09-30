import Decimal from 'decimal.js';
import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { edp } from '../extensionMethods/DecimalNumberExtensions';

const ShopItem = ({ children, cost, quantity, onPurchase, payMethod }) => {
    const {
        gameState,
        addVariablePoints
    } = useContext(GameContext);

    let disabled = true;

    let realQuantity = quantity;

    if ( gameState[payMethod].gte( cost.mul( quantity ) ) ) {
        disabled = false;
    }

    return (
        <div className="shop-item">
            <button onClick={() => {
                addVariablePoints(cost.mul(quantity).mul(-1.0));
                onPurchase();
            }} disabled={disabled}>{children}</button>
            <span className="cost">Cost: {cost.mul(quantity).toString()} {gameState.shortNames[payMethod]} (x{quantity})</span>
        </div>
    );
}

export default ShopItem