const ARITHMETIC_OPERATIONS = {
    "+": "plus",
    "-": "minus",
    "*": "mul",
    "/": "div",
    "**": "pow"
}

const convertToFunction = (code, header) => {
    code = code.map(c => {
        if (Object.keys(ARITHMETIC_OPERATIONS).some(k => c === k)) {
            c = `.${ARITHMETIC_OPERATIONS[c]}`;
        }
        return c;
    });
    code = code.join(" ");
    let fullCode = `function ${header} {\n${code}\n}`;
    const functionReg = /function *\w+\((.*)\) *{([\s\S]*)}/g;
    let match = functionReg.exec(fullCode);
    if (match) {
        return new Function(match[1].split(","), match[2]);
    }
    return null;
}

export {
    convertToFunction
}