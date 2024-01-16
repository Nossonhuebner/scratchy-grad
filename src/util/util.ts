import { Value } from "./engine"

export function softmax(batchValues: Value[][]) {
    return batchValues.map(softmaxRow)
}

function softmaxRow(values: Value[]) {
    // subtract maxVal to avoid NaN from exp explosions!
    const maxVal = Math.max(...values.map(v => v.data))
    const exps = values.map(v => v.minus(maxVal).exp())

    const sum = exps.reduce((acc, v) => acc.plus(v), new Value(0))
    return exps.map(v => v.divide(sum))
}

export function crossEntropyLoss(batchLogits: Value[][], targetIdx: number) {
    const batchProbs = softmax(batchLogits);

    const batchLoss = batchProbs.map(probs => probs[targetIdx].negativeLogLikelihood())
    return batchLoss.reduce((acc, loss) => acc.plus(loss), new Value(0))
}

export function negativeLogLikelihood(probs: Value[], target: number) {
    return probs[target].log().neg()
}
