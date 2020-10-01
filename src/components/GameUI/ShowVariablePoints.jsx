import React from 'react';
import {useSelector} from 'react-redux';

const ShowVariablePoints = () => {
    const variablePoints = useSelector (state => state.variablePoints);

    return (
        <h3 className="display-variable-points">
            Variable Points: {variablePoints.toString()}
        </h3>
    );
}

export default ShowVariablePoints;