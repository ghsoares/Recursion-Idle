export const incrementVariablePointsAction = (amount) => {
    return {
        type: "variablePoints/increment",
        payload: {
            amount
        }
    }
}

export const increaseLoopSpeedAction = (amount) => {
    return {
        type: "loopSpeed/increment",
        payload: {
            amount
        }
    }
}