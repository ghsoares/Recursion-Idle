import BigNumber from 'bignumber.js';
import Decimal from 'decimal.js';

const toExponentialDecimalPlaces = (n = new Decimal(1.0), dp, ep) => {
    let s = n.dp(dp).toString();
    let fpr = /(\d*)\.(\d*)e\+(\d+)/g;
    let m = fpr.exec(s);
    if (m) {
        let a = m[1];
        let b = m[2].slice(0, ep);
        let c = m[3];
        s = `${a}.${b}e+${c}`;
    }
    return s;
}

const edp = toExponentialDecimalPlaces;

export {
    toExponentialDecimalPlaces, edp
}