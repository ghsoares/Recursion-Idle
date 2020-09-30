import React from 'react';

const FunctionError = ({error}) => {
    const details = error.details.split("\n").map((ln, idx) => {
        return (<p key={idx}>{ln}</p>);
    })
    return (
        <div className="function-error-item">
            {(error.inputNumber != undefined) ? (
                <span className="function-error-loc">Error at input number {error.inputNumber}: </span>
            ) : (null)}
            <div className="function-error-details">{details}</div>
        </div>
    );
}

export default FunctionError;