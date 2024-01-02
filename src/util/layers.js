"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linear = void 0;
const neuron_1 = require("./neuron");
class Linear {
    constructor(nInputs, nOutputs) {
        this.neurons = [];
        const variance = 2 / (nInputs + nOutputs);
        const scale = Math.sqrt(variance);
        for (let i = 0; i < nOutputs; i++) {
            this.neurons.push(new neuron_1.Neuron(nInputs, scale));
        }
        1;
    }
    eval() { }
    train() { }
    forward(inputs) {
        return this.neurons.map(neuron => neuron.forward(inputs));
    }
    get parameters() {
        return this.neurons.map(neuron => neuron.parameters).flat();
    }
}
exports.Linear = Linear;
