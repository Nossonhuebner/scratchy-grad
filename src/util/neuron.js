"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neuron = void 0;
const engine_1 = require("./engine");
class Neuron {
    constructor(nInputs, scale, bias = true) {
        this.weights = [];
        const stdDev = scale !== null && scale !== void 0 ? scale : 1 / Math.sqrt(nInputs);
        for (let i = 0; i < nInputs; i++) {
            this.weights.push(new engine_1.Value(randomNormal(0, stdDev)));
        }
        if (bias) {
            this.bias = new engine_1.Value(0);
        }
    }
    forward(inputs) {
        let sum = new engine_1.Value(0);
        for (let i = 0; i < inputs.length; i++) {
            sum = sum.plus(this.weights[i].times(inputs[i]));
        }
        if (this.bias) {
            sum = sum.plus(this.bias);
        }
        return sum;
    }
    get parameters() {
        return this.weights.concat(this.bias ? this.bias : []);
    }
}
exports.Neuron = Neuron;
function randomNormal(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0)
        u = Math.random();
    while (v === 0)
        v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
