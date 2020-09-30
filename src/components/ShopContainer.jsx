import React, { useContext, useState } from 'react';
import { GameContext } from '../contexts/GameContext';
import ShopItem from './ShopItem';

const ShopContainer = () => {
    const {
        gameState: {
            purchaseAdd,
            costs,
            increaseCosts,
            memory
        },
        addLoopSpeed,
        setCost,
        setMemory
    } = useContext(GameContext);

    const [buyQuantity, setBuyQuantity] = useState(1);

    const changeBuyQuantity = () => {
        setBuyQuantity(prevBuyQuantity => {
            if (prevBuyQuantity < 10000) {
                return prevBuyQuantity * 10;
            }
            return 1;
        });
    }

    const purchaseLoopSpeed = () => {
        addLoopSpeed(purchaseAdd["loopSpeed"].mul(buyQuantity));
        const newCost = increaseCosts["loopSpeed"](costs["loopSpeed"].mul(buyQuantity));
        setCost("loopSpeed", newCost);
    }

    const purchaseMemory = () => {
        setMemory(memory.add(purchaseAdd["memory"].mul(buyQuantity)));
        const newCost = increaseCosts["memory"](costs["memory"].mul(buyQuantity));
        setCost("memory", newCost);
    }

    return (
        <div className="shop-container">
            <h2 className="tab-title">Shop</h2>
        	<button className="change-buy-quantity" onClick={changeBuyQuantity}>Buy {buyQuantity}</button>
            <ShopItem
                cost={costs["memory"]}
                quantity={buyQuantity}
                payMethod={"variablePoints"}
                onPurchase={() => purchaseMemory()}
            >Increase Memory by {purchaseAdd["memory"].toString()}Kb</ShopItem>
            <ShopItem
                cost={costs["loopSpeed"]}
                quantity={buyQuantity}
                payMethod={"variablePoints"}
                onPurchase={() => purchaseLoopSpeed()}
            >Increase Loop Speed by {purchaseAdd["loopSpeed"].toString()}</ShopItem>
        </div>
    );
}

export default ShopContainer;