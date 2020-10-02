import React from 'react';

const FunctionItem = ({func}) => {
    return (
        <div className="function-item">
            <div className="function">
                <span className="function-header">
                    function <span>{func.name}</span>(x) {"{"}
                </span>
                <div className="function-body">
                    {func.pattern}
                </div>
                <span className="function-footer">{"}"}</span>
            </div>
        </div>
    );
}

export default FunctionItem;