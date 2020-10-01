import React, { useRef, useContext, useState } from 'react';

import { GameContext } from '../contexts/GameContext';
import { convertToFunction } from '../tokenizer/Interpreter';
import FunctionUserInput from './FunctionUserInput';
import $ from "jquery";
import FunctionError from './FunctionError';
import Decimal from 'decimal.js';
import FunctionErrorsContainer from './FunctionErrorsContainer';

const FunctionItem = ({func}) => {
    const {
        setGameState
    } = useContext(GameContext);

    const formRef = useRef();
    const pState = func.precompiledState;
    const {functionName} = func;

    const formSubmit = (e) => {
        e.preventDefault();
    }

    const onInputChange = (e, value, inputId) => {
        pState.inputs[inputId] = value;
        setGameState(prevGameState => {
            prevGameState["functions"][functionName]["precompiledState"] = pState;
            return prevGameState;
        });
    }

    let argIdx = 0;
    let functionBodyRender = func.functionString.split("@").map((s, idx) => {
        const funcInputVariableReg = /(\$v\d+)/g;
        const funcInputOperationReg = /(\$o\d+)/g;
        let match = funcInputVariableReg.exec(s);
        let initArg = pState.inputs[argIdx];
        if (match) {
            argIdx += 1;
            return (<FunctionUserInput
                key={idx}
                inputId={argIdx-1}
                onChange={onInputChange}
                initialValue={initArg}
                type="v"
                name={match[1]}/>);
        }
        match = funcInputOperationReg.exec(s);
        if (match) {
            argIdx += 1;
            return (<FunctionUserInput
                key={idx}
                inputId={argIdx-1}
                onChange={onInputChange}
                initialValue={initArg}
                type="o"
                name={match[1]}/>);
        }

        return (<span key={idx} className="function-text">{s}</span>);
    });

    let errorsRender = pState.errors.map((err, idx) => {
        return (<FunctionError key={idx} error={err}/>);
    });

    return (
        <form
            ref={formRef}
            onSubmit={formSubmit}
            className="function-item"
        >
            <span className="function-wrapper">function <span>{functionName}</span>(x) {"{"}</span>
            <div className="function-body">
                {functionBodyRender}
            </div>
            <span className="function-wrapper">{"}"}</span>
            <FunctionErrorsContainer func={func}/>
        </form>
    );
}

export default FunctionItem;