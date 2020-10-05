/*

    A JS module to convert regular javascript operations into
    Decimal operations
    
*/

const LINE_SEPARATOR = /;\n|;|\n/g;
const ARITHMETIC_OERATORS = /(\*\*|\+|-|\*|\/|%)/g;
const SHORTHAND_OPERATORS = /(\w*) *([+\-/*%] *[/*]*) *= *(\w*)/g;
const NUMBER_LITERAL = /((?:[-+]?0x\w+)|(?:[-+]?0b\w+)|(?:[-+]?\d+\.?\d*(?:[Ee][-+]?\d+)?)|(?:[-+]?\d+))/g;

//#region Shorthand Operations
/*
    Parses shorthand operators into simple operations
    Examples:
        "var1 **= var2" into "var1 = var1 ** var2",
        "var1 += var2" into "var1 = var1 + var2",
        "var1 -= var2" into "var1 = var1 - var2",
        "var1 *= var2" into "var1 = var1 * var2",
        "var1 /= var2" into "var1 = var1 / var2",
        "var1 %= var2" into "var1 = var1 % var2",
*/
function parseShorthandOperators(codeLines = []) {
    codeLines = codeLines.map((line = "") => {
        line = line.replace(SHORTHAND_OPERATORS, (subs, ...args) => {
            let param1 = args[0];
            let operation = args[1];
            let param2 = args[2];
            subs = `${param1} = ${param1} ${operation} ${param2}`;
            return subs;
        });
        return line;
    });
    return codeLines;
}
//#endregion

//#region Store Number Literals
/*
    Extracts the number literals, replace those with "$x", store the extracted numbers in a array to 
    parse latter
*/
function separateNumberLiterals(codeLines = []) {
    let separated = [];
    codeLines = codeLines.map((line = "") => {
        line = line.replace(NUMBER_LITERAL, (substr) => {
            separated.push(`new Decimal("${substr}")`);
            return `$${separated.length - 1}`;
        });
        return line;
    });
    return [codeLines, separated];
}
//#endregion

//#region Open Operations
/*
    Simple lines process to open spaces in both ends of operations
*/
function openOperations(codeLines = []) {
    codeLines = codeLines.map((line = "") => {
        line = line.replace(/(\*\*|\+|-|\*|\/|%|=)/g, " $1 ");
        return line;
    });
    return codeLines;
}
//#endregion

//#region Wrap Values
/*
    Wraps some values into parentheses, so there's less risk in parsing to Decimal operations
    Example:
        var test = 1.0;
        var othertest = 2.0
        let anothertest = 3.0

        return test1 * othertest / anothertest - 1.0;
    Will turn into:
        var test = (1.0);
        var othertest = (2.0)
        let anothertest = (3.0)

        return (test1) * (othertest) / (anothertest) - (1.0);

*/
function wrapValues(codeLines = []) {
    codeLines = codeLines.map((line = "") => {
        let lines = line.split(/ +/g);
        line = lines
            .map((frag, idx) => {
                if (idx === 0) return frag;
                if (lines[idx - 1].match(/var|let|const/g)) return frag;
                if (frag.match(/(\*\*|\+|-|\*|\/|%|=)/g)) return frag;
                return `( ${frag} )`;
            })
            .join(" ");
        return line;
    });
    return codeLines;
}
//#endregion

//#region Parse Arithmetic Operations
/*
    Parses the regular javascript arithmetic operations into Decimal operations
    Example:
        var test = (1.0);
        var othertest = (2.0)
        let anothertest = (3.0)

        return (test1) * (othertest) / (anothertest) - (1.0);
    Will turn into:
        var test = (1.0);
        var othertest = (2.0)
        let anothertest = (3.0)

        return (test1) .mul (othertest) .div (anothertest) .minus (1.0);
    Warning: As the order of the operations is per call, so the result will
    NOT be the same as the regular arithmetic operations
*/
function parseArithmeticOperations(codeLines) {
    codeLines = codeLines.map((line = "") => {
        line = line.replace(ARITHMETIC_OERATORS, (substr) => {
            switch (substr) {
                case "+":
                    substr = ".add";
                    break;
                case "-":
                    substr = ".sub";
                    break;
                case "*":
                    substr = ".mul";
                    break;
                case "/":
                    substr = ".div";
                    break;
                case "**":
                    substr = ".pow";
                    break;
                case "%":
                    substr = ".mod";
                    break;
                default:
                    break;
            }
            return substr;
        });
        return line;
    });
    return codeLines;
}
//#endregion

function insertNumberLiterals(codeLines, literals) {
  codeLines = codeLines.map(line => {
    line = line.replace(/\$(\d+)/g, (subs, ...args) => {
      let idx = Number(args[0]);
      subs = literals[idx];
      return subs;
    })
    return line;
  });
  return codeLines;
}

/*
    Transforms valid javascript script into valid script with Decimal operations (optimized for performance)
*/
function parseCode(code) {
  return new Promise((resolve, reject) => {
    let codeLines = code.split(LINE_SEPARATOR);
    let last = codeLines[codeLines.length - 1];
    if (last === "") {
      codeLines.pop();
    }

    let separated = separateNumberLiterals(codeLines);
    codeLines = separated[0];
    let separatedNumbers = separated[1];

    codeLines = parseShorthandOperators(codeLines);

    codeLines = openOperations(codeLines);
    codeLines = wrapValues(codeLines);
    codeLines = parseArithmeticOperations(codeLines);
    codeLines = insertNumberLiterals(codeLines, separatedNumbers);

    code = codeLines.join(";\n");

    resolve(code);
  })
}

/*
    Builds a function with function name, arguments and body
*/
function buildFunction(functionArgs = ["a"], body = "return a;") {
    functionArgs.push("Decimal");
    // eslint-disable-next-line
    return new Function(...functionArgs, body);
}

export { parseCode, buildFunction };
