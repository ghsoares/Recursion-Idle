import React from 'react';
import { useSelector } from 'react-redux';
import FunctionItem from './FunctionItem';

const FunctionContainer = () => {
    const functions = useSelector(state => state.functions);

    const functionItems = functions.map((f, idx) => <FunctionItem key={idx} func={f}/>);

    return (
        <div className="game-tab functions">
            <h1 className="game-tab-header">Functions</h1>
            <hr/>
            {functionItems}
        </div>
    );
}

export default FunctionContainer;