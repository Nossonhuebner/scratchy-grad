"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embedding = exports.Tanh = exports.Linear = void 0;
const engine_1 = require("./engine");
const neuron_1 = require("./neuron");
class Linear {
    constructor(nInputs, nOutputs) {
        this.neurons = [];
        const variance = 2 / (nInputs + nOutputs);
        const scale = Math.sqrt(variance);
        for (let i = 0; i < nOutputs; i++) {
            this.neurons.push(new neuron_1.Neuron(nInputs, scale));
        }
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
class Tanh {
    get parameters() {
        return [];
    }
    eval() { }
    train() { }
    forward(inputs) {
        return inputs.map(i => (0, engine_1.asValue)(i).tanh());
    }
}
exports.Tanh = Tanh;
class Embedding {
    constructor(nVocab, embeddingSize) {
        this.neurons = [];
        this.nVocab = nVocab;
        for (let i = 0; i < nVocab; i++) {
            this.neurons.push(new neuron_1.Neuron(embeddingSize));
        }
    }
    get parameters() {
        return [];
    }
    eval() { }
    train() { }
    forward(encodedInputs) {
        const isn = encodedInputs;
        const arr = new Array(this.nVocab);
        // TODO
        //    const oneHot = arr.map(e => )
        return [];
    }
}
exports.Embedding = Embedding;
