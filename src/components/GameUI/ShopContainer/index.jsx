import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ShopItem from './ShopItem';

const ShopContainer = ({className}) => {
    const [qtd, setQtd] = useState(1);

    const shop = useSelector(state => state.shop.items);
    const shopItems = Object.keys(shop).map((name) => <ShopItem qtd={qtd} key={name} itemName={name} item={shop[name]} />);

    return (
        <div className="game-tab shop">
            <h1 className="game-tab-header">Shop</h1>
            <hr/>
            {shopItems}
        </div>
    );
}

export default ShopContainer;