"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.negativeLogLikelihood = exports.crossEntropyLoss = exports.softmax = void 0;
const engine_1 = require("./engine");
function softmax(batchValues) {
    return batchValues.map(softmaxRow);
}
exports.softmax = softmax;
function softmaxRow(values) {
    // subtract maxVal to avoid NaN from exp explosions!
    const maxVal = Math.max(...values.map(v => v.data));
    const exps = values.map(v => v.minus(maxVal).exp());
    const sum = exps.reduce((acc, v) => acc.plus(v), new engine_1.Value(0));
    return exps.map(v => v.divide(sum));
}
function crossEntropyLoss(batchLogits, targetIdx) {
    const batchProbs = softmax(batchLogits);
    const batchLoss = batchProbs.map(probs => probs[targetIdx].negativeLogLikelihood());
    return batchLoss.reduce((acc, loss) => acc.plus(loss), new engine_1.Value(0));
}
exports.crossEntropyLoss = crossEntropyLoss;
function negativeLogLikelihood(probs, target) {
    return probs[target].log().neg();
}
exports.negativeLogLikelihood = negativeLogLikelihood;
