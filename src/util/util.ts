import { Value } from "./engine"

export function softmax(values: Value[]) {
    // subtract maxVal to avoid NaN from exp explosions!
    const maxVal = Math.max(...values.map(v => v.data))

    const exps = values.map(v => v.minus(maxVal).exp())
    const sum = exps.reduce((acc, v) => acc.plus(v), new Value(0))
    return exps.map(v => v.divide(sum))
}

export function negativeLogLikelihood(probs: Value[], target: number) {
    return probs[target].log().neg()
}
