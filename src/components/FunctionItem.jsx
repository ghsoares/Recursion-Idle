import React, { useRef, useContext, useState } from 'react';

import { GameContext } from '../contexts/GameContext';
import { convertToFunction } from '../tokenizer/Interpreter';
import FunctionUserInput from './FunctionUserInput';
import $ from "jquery";
import FunctionError from './FunctionError';
import Decimal from 'decimal.js';

const FunctionItem = ({functionName, function: {currentInputs, precompiled, compiled} }) => {
    const {
        gameState: {
            startVariable,
            memory,
            usedMemory
        },
        setFunction,
        setUsedMemory
    } = useContext(GameContext);

    const formRef = useRef();
    const [errorsState, setErrors] = useState([]);
    const [functionCost, setFunctionCost] = useState(compiled(startVariable, Decimal));

    const compile = () => {
        return new Promise((resolve, reject) => {
            const form = formRef.current;

            const formData = $(form).serializeArray();
            let errors = []

            let result = ["return", "x"];
            let newInputs = []

            formData.forEach(data => {
                let v = data.value;
                let type = data.name.match(/(?!$)\w(?=\d+)/g)[0];
                let inpNum = Number(data.name.match(/(?!$\w)\d+/g)[0]);

                if (v === "") {
                    errors.push({
                        inputNumber: inpNum,
                        details: `is missing input!`
                    });
                } else {
                    if (type === "v") {
                        if (!isNaN(v)) {
                            result.push(`(new Decimal('${v}'))`);
                        } else if (v.indexOf("x") >= 0) {
                            result.push(`(${v})`);
                        } else {
                            errors.push({
                                inputNumber: inpNum,
                                details: `the variable "${v}" doesn't exist!`
                            });
                        }
                    } else if (type === "o") {
                        if (["+","-","*","/","**"].some(o => v === o)) {
                            result.push(v);
                        } else {
                            errors.push({
                                inputNumber: inpNum,
                                details: `the operation "${v}" doesn't exist!`
                            });
                        }
                    }
                }

                newInputs.push(v);
            });

            if (errors.length > 0) {
                reject(errors);
                return;
            }

            const f = convertToFunction(result, `${functionName}(x, Decimal)`);
            let newMemory;

            try {
                const test = f(startVariable, Decimal);
                if (test === undefined || test === null) {
                    throw "somehow, your function returns nothing at all...";
                }
                if (test.lte(new Decimal(0.0))) {
                    throw "the function must return something that is bigger than 1!";
                }

                const diff = test.sub(functionCost);
                newMemory = usedMemory.add(diff);

                if (newMemory.gt(memory)) {
                    throw "the function return value will overflow the PC's memory!"
                }
            } catch (err) {
                reject([{
                    inputNumber: undefined,
                    details: err.toString()
                }]);
            }

            resolve([f, newInputs, newMemory]);
        });
    }

    const onCompile = (e) => {
        e.preventDefault();
        closeErrors();
        compile()
            .then(res => {
                setFunction(functionName, (prevFunction) => {
                    prevFunction.compiled = res[0];
                    prevFunction.currentInputs = res[1];
                    return prevFunction;
                });
                setUsedMemory(res[2]);
                setFunctionCost(res[2]);
            })
            .catch(errs => {
                setErrors(errs)
            });
    }

    const closeErrors = () => {
        setErrors([]);
    }

    let argIdx = 0;
    let functionBodyRender = precompiled.split("@").map((s, idx) => {
        const funcInputVariableReg = /(\$v\d+)/g;
        const funcInputOperationReg = /(\$o\d+)/g;
        let match = funcInputVariableReg.exec(s);
        let initArg = currentInputs[argIdx]
        if (match) {
            argIdx += 1;
            return (<FunctionUserInput key={idx} initialValue={initArg} type="v" name={match[1]}/>);
        }
        match = funcInputOperationReg.exec(s);
        if (match) {
            argIdx += 1;
            return (<FunctionUserInput key={idx} initialValue={initArg} type="o" name={match[1]}/>);
        }

        return (<span key={idx} className="function-text">{s}</span>);
    });

    let errorsRender = errorsState.map((err, idx) => {
        return (<FunctionError key={idx} error={err}/>);
    });

    return (
        <form
            ref={formRef}
            onSubmit={onCompile}
            className="function-item"
        >
            <span className="function-wrapper">function <span>{functionName}</span>(x) {"{"}</span>
            <div className="function-body">
                {functionBodyRender}
            </div>
            <span className="function-wrapper">{"}"}</span>
            {errorsRender.length !== 0 ? ([
                <div key={0} className="error-top">
                    <span>Errors on compilation:</span>
                    <button onClick={closeErrors}>Close</button>
                </div>,
                <div key={1} className="error-list">{errorsRender}</div>
            ]) : (null)}
            <button type="submit">Compile</button>
        </form>
    );
}

export default FunctionItem;