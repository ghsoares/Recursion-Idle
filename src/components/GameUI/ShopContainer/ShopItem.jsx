import React from 'react';
import { useDispatch } from 'react-redux';
import { shopPurchaseAction } from '../../../game state/Actions';

const ShopItem = ({qtd, itemName, item}) => {
    const dispatch = useDispatch();

    const buy = () => {
        dispatch(shopPurchaseAction(itemName, qtd));
    }

    let disabled = true;

    let totalPrice = item.currentPrice;
    let currentI = qtd;

    while ((currentI -= 1) > 0) {
        totalPrice = item.priceIncrease(totalPrice);
    }

    console.log(totalPrice.toString());

    return (
        <div className="shop-item">
            <button onClick={buy} disabled={disabled}>{item.label(qtd)}</button>
        </div>
    );
}

export default ShopItem;