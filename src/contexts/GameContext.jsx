import React, {createContext, useState} from 'react';
import BigNumber from 'bignumber.js';
import Interpreter from '../tokenizer/Interpreter';
import Decimal from 'decimal.js';

export const GameContext = createContext();

const GameProvider = ({children}) => {
    /*BigNumber.config({
        DECIMAL_PLACES: 4,
        EXPONENTIAL_AT: 16,
        ROUNDING_MODE: BigNumber.ROUND_HALF_UP
    });*/

    Decimal.set({
        toExpPos: 9,
        toExpNeg: -9,
        precision: 8,
    });

    const [gameState, setGameState] = useState({
        variablePoints: new Decimal(0.0),
        loopSpeed: new Decimal(1.0),
        memory: new Decimal(1),
        usedMemory: new Decimal(1),
        speedAdd: new Decimal(0.025),
        purchaseAdd: {
            "loopSpeed": new Decimal(0.025),
            "memory": new Decimal(1)
        },
        costs: {
            "loopSpeed": new Decimal(250),
            "memory": new Decimal(30)
        },
        increaseCosts: {
            "loopSpeed": (e) => e.mul(2.0),
            "memory": (e) => e.mul(1.5)
        },
        shortNames: {
            "variablePoints": "VarP",
        },
        startVariable: new Decimal(1.0),
        functions: {
            "myFunction1": {
                "currentInputs": ["*", "1"],
                "precompiled": "return x@$o1@$v2;",
                "compiled": function(x, Decimal) {
                    return x.mul(new Decimal(1));
                }
            },
        }
    });

    const addVariablePoints = (addPoints) => {
        setGameState(prevGameState => ({
            ...prevGameState,
            variablePoints: prevGameState.variablePoints.add(addPoints)
        }));
    }

    const addLoopSpeed = (addSpeed) => {
        setGameState(prevGameState => ({
            ...prevGameState,
            loopSpeed: prevGameState.loopSpeed.add(addSpeed)
        }));
    }

    const setCost = (costName, newCost) => {
        setGameState(prevGameState => {
            let costs = {...prevGameState.costs};
            costs[costName] = newCost;
            return {
                ...prevGameState,
                costs: costs
            }
        });
    }

    const setFunction = (functionName, callback = (prevFunction) => prevFunction) => {
        setGameState(prevGameState => {
            let functions = {...prevGameState.functions};
            let prev = functions[functionName];
            if (!prev) {
                prev = {
                    "currentInputs": [],
                    "precompiled": "return@x;",
                    "compiled": function(x, Decimal) {return x;}
                };
            }

            functions[functionName] = callback(prev);

            return {
                ...prevGameState,
                functions
            }
        });
    }

    const setUsedMemory = (newUsedMemory) => {
        setGameState(prevGameState => ({
            ...prevGameState,
            usedMemory: newUsedMemory
        }));
    }

    const setMemory = (newMemory) => {
        setGameState(prevGameState => ({
            ...prevGameState,
            memory: newMemory
        }));
    }

    return (
        <GameContext.Provider value={{
            gameState,
            addVariablePoints,
            addLoopSpeed,
            setCost,
            setFunction,
            setUsedMemory,
            setMemory
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;