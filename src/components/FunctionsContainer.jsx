import Decimal from 'decimal.js';
import React, {} from 'react';
import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { convertToFunction } from '../tokenizer/Interpreter';
import FunctionItem from './FunctionItem';

const FunctionsContainer = () => {
    const {
        gameState: {functions, memory, startVariable},
        setGameState,
        helperFunctions: {calculateUsedMemory}
    } = useContext(GameContext);

    let functionsBodies = [];

    functionsBodies = Object.keys(functions).map((k, idx) => {
        let name = k;
        return <FunctionItem key={idx} func={functions[k]}/>
    });

    const compile = (func, usedMemory) => {
        return new Promise((resolve, reject) => {
            let errors = [];

            let result = ["return", "x"];
            let newInputs = [];

            let functionString = func["functionString"].split("@");
            let functionInputs = functionString.filter(s => s.match(/\$(\w)(\d)/g));

            func["precompiledState"]["inputs"].forEach((inp, idx) => {
                let inpS = functionInputs[idx];
                let type = (/\$(\w)/g).exec(inpS)[1];

                if (inp === "") {
                    errors.push({
                        inputNumber: idx+1,
                        details: `is missing input!`
                    });
                } else {
                    if (type === "v") {
                        if (!isNaN(inp)) {
                            result.push(`(new Decimal('${inp}'))`);
                        } else if (inp === 0) {
                            result.push(`(${inp})`);
                        } else {
                            errors.push({
                                inputNumber: idx+1,
                                details: `the variable "${inp}" doesn't exist!`
                            });
                        }
                    } else if (type === "o") {
                        if (["+","-","*","/","**"].some(o => inp === o)) {
                            result.push(inp);
                        } else {
                            errors.push({
                                inputNumber: idx+1,
                                details: `the operation "${inp}" doesn't exist!`
                            });
                        }
                    }
                }

                newInputs.push(inp);
            });
        
            if (errors.length > 0) {
                reject(errors);
                return;
            }

            const f = convertToFunction(result, `${func["functionName"]}(x, Decimal)`);

            let newMemory;
            let cost;

            try {
                const test = f(startVariable, Decimal);
                if (test === undefined || test === null) {
                    throw "somehow, your function returns nothing at all...";
                }
                if (test.lte(new Decimal(0.0))) {
                    throw "the function must return something that is bigger than 1!";
                }

                cost = test;
                const diff = test.sub(func["compiledState"]["cost"]);
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

            resolve([f, newInputs, newMemory, cost]);
        });
    }

    const compileAll = async () => {
        let usedMemory = calculateUsedMemory();
        let funcs = Object.values(functions)
        for (let f of funcs) {
            try {
                let res = await compile(f, usedMemory);
                setGameState(prevGameState => {
                    prevGameState["functions"][f["functionName"]]["precompiledState"]["errors"] = [];
                    const compiledState = prevGameState["functions"][f["functionName"]]["compiledState"];
                    compiledState["inputs"] = res[1];
                    compiledState["function"] = res[0];
                    compiledState["cost"] = res[3];
                    return prevGameState;
                });
                usedMemory = res[2]
            } catch (errs) {
                setGameState(prevGameState => {
                    prevGameState["functions"][f["functionName"]]["precompiledState"]["errors"] = errs;
                    return prevGameState;
                });
            }
        }
    }

    return (
        <div>
            <h2 className="tab-title">Functions</h2>
            <div className="functions-list">
                {functionsBodies}
            </div>
            <button className="functions-compile" onClick={compileAll}>Compile!</button>
        </div>
    );
}

export default FunctionsContainer;