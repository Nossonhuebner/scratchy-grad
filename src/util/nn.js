"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.negativeLogLikelihood = exports.softmax = exports.MLP = exports.Layer = exports.Neuron = void 0;
const engine_1 = require("./engine");
class Neuron {
    constructor(nInputs, nonLinear, scale) {
        this.weights = [];
        for (let i = 0; i < nInputs; i++) {
            const val = scale ? randomNormal(0, scale) : Math.random();
            this.weights.push(new engine_1.Value(val));
        }
        this.bias = new engine_1.Value(0);
        this.nonLinear = nonLinear;
    }
    forward(inputs) {
        let sum = new engine_1.Value(0);
        for (let i = 0; i < inputs.length; i++) {
            sum = sum.plus(this.weights[i].times(inputs[i]));
        }
        sum = sum.plus(this.bias);
        return sum;
    }
    get parameters() {
        return this.weights.concat(this.bias);
    }
}
exports.Neuron = Neuron;
class Layer {
    constructor(nInputs, nOutputs, nonLinear) {
        this.neurons = [];
        const variance = 2 / (nInputs + nOutputs);
        const scale = Math.sqrt(variance);
        for (let i = 0; i < nOutputs; i++) {
            this.neurons.push(new Neuron(nInputs, nonLinear, scale));
        }
        1;
    }
    forward(inputs) {
        return this.neurons.map(neuron => neuron.forward(inputs));
    }
    get parameters() {
        return this.neurons.map(neuron => neuron.parameters).flat();
    }
}
exports.Layer = Layer;
class MLP {
    constructor(nInputs, nOutputs) {
        this.layers = [];
        const layerConfig = [nInputs, ...nOutputs];
        for (let i = 0; i < layerConfig.length - 1; i++) {
            const nIn = layerConfig[i];
            const nOut = layerConfig[i + 1];
            const nonLinear = i < layerConfig.length - 2;
            this.layers.push(new Layer(nIn, nOut, nonLinear));
        }
    }
    forward(inputs) {
        let inns = inputs;
        let outs = []; // fix this - was done for typing
        for (let i = 0; i < this.layers.length; i++) {
            outs = this.layers[i].forward(inns);
            inns = outs;
        }
        return outs;
    }
    get parameters() {
        return this.layers.map(layer => layer.parameters).flat();
    }
}
exports.MLP = MLP;
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
function randomNormal(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0)
        u = Math.random();
    while (v === 0)
        v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
