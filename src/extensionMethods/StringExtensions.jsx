const getRowColumnFromIndex = function(s, idx) {
    let lines = s.split("\n");
    let row = 0;
    let column = 0;
    /*
    "
    aaaa
    bbbbbbb
    "
    idx = 5
    */
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.length - 1 < column) {
            column = line.length;
        } else {
            idx += line.length;
            row += 1;
        }
    }
    return {row, column}
}

export {
    getRowColumnFromIndex
}