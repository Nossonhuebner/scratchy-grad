"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchNorm = exports.Embedding = exports.Tanh = exports.Linear = void 0;
const engine_1 = require("./engine");
const neuron_1 = require("./neuron");
class Linear {
    constructor(nInputs, nOutputs, bias = true) {
        this.neurons = [];
        const variance = 2 / (nInputs + nOutputs);
        const scale = Math.sqrt(variance);
        for (let i = 0; i < nOutputs; i++) {
            this.neurons.push(new neuron_1.Neuron(nInputs, scale, bias));
        }
    }
    eval() { }
    train() { }
    forward(inputBatch) {
        return inputBatch.map(input => {
            return this.neurons.map(neuron => neuron.forward(input));
        });
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
    forward(inputBatch) {
        return inputBatch.map(input => {
            return input.map(i => (0, engine_1.asValue)(i).tanh());
        });
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
        const inns = encodedInputs;
        const arr = new Array(this.nVocab);
        // TODO
        //    const oneHot = arr.map(e => )
        return [];
    }
}
exports.Embedding = Embedding;
class BatchNorm {
    constructor(inputSize, epsilon, momentum) {
        this._train = true;
        this.epsilon = epsilon;
        this.momentum = momentum;
        this.gamma = new Array(inputSize).map(_ => new engine_1.Value(1));
        this.beta = new Array(inputSize).map(_ => new engine_1.Value(0));
        this.runningMean = new Array(inputSize).map(_ => new engine_1.Value(0));
        this.runningVariance = new Array(inputSize).map(_ => new engine_1.Value(1));
    }
    forward(inputBatch) {
        const batch = inputBatch; // Will always be Value[][]... better way?
        return this._train ? this._trainForward(batch) : this._evalForward(batch);
    }
    _trainForward(inputBatch) {
        const means = this._calcMeans(inputBatch);
        const variances = this._calcVariances(inputBatch, means);
        const out = this._shift(inputBatch, means, variances);
        this._updateRunningMean(means);
        this._updateRunningVariance(variances);
        return out;
    }
    _updateRunningMean(means) {
        // using Value.data directly here because we don't want to update the gradient
        this.runningMean.forEach((runningMean, i) => {
            const weightedPrevMean = runningMean.data * (1 - this.momentum);
            const weightedNewMean = means[i].data * this.momentum;
            runningMean.data = weightedPrevMean + weightedNewMean;
        });
    }
    _updateRunningVariance(variances) {
        // using Value.data directly here because we don't want to update the gradient
        this.runningVariance.forEach((runningVariance, i) => {
            const weightedPrevVariance = runningVariance.data * (1 - this.momentum);
            const weightedNewVariance = variances[i].data * this.momentum;
            runningVariance.data = weightedPrevVariance + weightedNewVariance;
        });
    }
    _calcMeans(inputBatch) {
        return inputBatch.reduce((acc, input) => {
            return acc.map((mean, i) => mean.plus(input[i].divide(inputBatch.length)));
        }, this.runningMean);
    }
    _calcVariances(inputBatch, means) {
        return inputBatch.reduce((acc, input) => {
            return acc.map((variance, i) => {
                const diff = input[i].minus(means[i]);
                return variance.plus(diff.times(diff).divide(inputBatch.length));
            });
        }, this.runningVariance);
    }
    _evalForward(inputBatch) {
        return this._shift(inputBatch, this.runningMean, this.runningVariance);
    }
    _shift(inputBatch, mean, variance) {
        return inputBatch.map((input) => {
            return input.map((x, i) => {
                const xhat = x.minus(mean[i])
                    .divide((variance[i].plus(this.epsilon)).sqrt());
                return xhat.times(this.gamma[i]).plus(this.beta[i]);
            });
        });
    }
    get parameters() {
        return this.gamma.concat(this.beta);
    }
    eval() {
        this._train = false;
    }
    train() {
        this._train = true;
    }
    ;
}
exports.BatchNorm = BatchNorm;
