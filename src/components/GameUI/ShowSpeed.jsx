import React from 'react';
import { useSelector } from 'react-redux';

const ShowSpeed = () => {
    const operationsPerSecond = useSelector(state => state.operationsPerSecond);

    return (
        <h3 className="display-loop-speed">
            Operations per Second: <span>{operationsPerSecond.toDP(1).toString()}</span> OPs/Sec
        </h3>
    );
}

export default ShowSpeed;