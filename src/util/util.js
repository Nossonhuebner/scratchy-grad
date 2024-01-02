"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.negativeLogLikelihood = exports.softmax = void 0;
const engine_1 = require("./engine");
function softmax(values) {
    // subtract maxVal to avoid NaN from exp explosions!
    const maxVal = Math.max(...values.map(v => v.data));
    const exps = values.map(v => v.minus(maxVal).exp());
    const sum = exps.reduce((acc, v) => acc.plus(v), new engine_1.Value(0));
    return exps.map(v => v.divide(sum));
}
exports.softmax = softmax;
function negativeLogLikelihood(probs, target) {
    return probs[target].log().neg();
}
exports.negativeLogLikelihood = negativeLogLikelihood;
