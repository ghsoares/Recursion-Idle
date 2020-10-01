import React, {createContext, useState} from 'react';
import Interpreter from '../tokenizer/Interpreter';
import Decimal from 'decimal.js';

export const GameContext = createContext();

const GameProvider = ({children}) => {
    Decimal.set({
        toExpPos: 9,
        toExpNeg: -9,
        precision: 8,
    });

    const [gameState, setGameState] = useState({
        variablePoints: new Decimal(0.0),
        loopSpeed: new Decimal(1.0),
        memory: new Decimal(1),
        purchaseAdd: {
            "loopSpeed": new Decimal(0.1),
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
                "functionName": "myFunction1",
                "functionString": "return x@$o1@$v2;",
                "precompiledState": {
                    "inputs": ["*", "1"],
                    "errors": []
                },
                "compiledState": {
                    "inputs": ["*", "1"],
                    "function": function(x, Decimal) {
                        return x.mul(new Decimal(1));
                    },
                    "cost": new Decimal(1)
                },
                "compiling": false
            },
        },
    });

    const calculateUsedMemory = () => {
        let cost = new Decimal(0);
        Object.keys(gameState.functions).forEach(fName => {
            cost = cost.add(gameState.functions[fName]["compiledState"]["cost"]);
        });
        return cost;
    }

    return (
        <GameContext.Provider value={{
            gameState,
            setGameState,
            helperFunctions: {
                calculateUsedMemory
            }
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;