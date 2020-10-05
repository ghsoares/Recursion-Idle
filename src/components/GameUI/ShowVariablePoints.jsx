import React from 'react';
import {useSelector} from 'react-redux';

const ShowVariablePoints = () => {
    const variablePoints = useSelector (state => state.variablePoints);

    return (
        <h2 className="display-variable-points">
            Variable Points: <span>{variablePoints.toDP(0).toString()}</span>
        </h2>
    );
}

export default ShowVariablePoints;