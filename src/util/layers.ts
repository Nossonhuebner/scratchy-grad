import { Value, asValue } from "./engine";
import { Neuron } from "./neuron";

export interface ILayer {
    forward: (inputBatch: (Value | number)[][]) => Value[][];
    readonly parameters: Value[];
    eval: () => void;
    train: () => void;
}

export class Linear implements ILayer {
    neurons: Neuron[];
    constructor(nInputs: number, nOutputs: number, bias = true) {
        this.neurons = [];

        const variance = 2 / (nInputs + nOutputs);
        const scale = Math.sqrt(variance);

        for (let i = 0; i < nOutputs; i++) {
            this.neurons.push(new Neuron(nInputs, scale, bias));
        }
    }
    eval() {}
    train() {}

    forward(inputBatch: (Value | number)[][]) {
        return inputBatch.map(input => {
            return this.neurons.map(neuron => neuron.forward(input))
        })
    }

    get parameters() {
        return this.neurons.map(neuron => neuron.parameters).flat();
    }
}

export class Tanh implements ILayer {
    get parameters() {
        return [];
    }
    eval () {}
    train () {}
    forward(inputBatch: (number | Value)[][]){
        return inputBatch.map(input => {
            return input.map(i => asValue(i).tanh())
        })
    }
}

export class Embedding implements ILayer {
    neurons: Neuron[];
    nVocab: number;

    constructor(nVocab: number, embeddingSize: number) {
        this.neurons = [];
        this.nVocab = nVocab;
        for(let i = 0; i < nVocab; i++) {
            this.neurons.push(new Neuron(embeddingSize))
        }
    }
    get parameters() {
        return [];
    }
    eval () {}
    train () {}
    forward(encodedInputs: (number | Value)[][]){
       const inns = encodedInputs as number[][];
       const arr = new Array(this.nVocab)
       // TODO
        //    const oneHot = arr.map(e => )
        return []
    }
    
}

export class BatchNorm implements ILayer {
    // epsilon - added to denominator to avoid division by 0;
    // momentum - how much relevant weight we attribute to later batch calculations when updating std
    epsilon: number;
    momentum: number;
    gamma: Value[];
    beta: Value[];

    runningMean: Value[];
    runningVariance: Value[];
    _train: boolean;
    constructor(inputSize: number, epsilon: 0.00001, momentum: 0.001) {
        this._train = true;
        this.epsilon = epsilon;
        this.momentum = momentum;
        this.gamma = new Array(inputSize).map(_ => new Value(1))
        this.beta = new Array(inputSize).map(_ => new Value(0))

        this.runningMean = new Array(inputSize).map(_ => new Value(0))
        this.runningVariance = new Array(inputSize).map(_ => new Value(1))
    }

    forward(inputBatch: (number | Value)[][]) {
        const batch = inputBatch as Value[][]; // Will always be Value[][]... better way?
        return this._train ? this._trainForward(batch) : this._evalForward(batch);
    }

    _trainForward(inputBatch: Value[][]) {
        const means = this._calcMeans(inputBatch);
        const variances = this._calcVariances(inputBatch, means);
        const out = this._shift(inputBatch, means, variances);

        this._updateRunningMean(means);
        this._updateRunningVariance(variances);
        return out;
    }

    _updateRunningMean(means: Value[]) {
        // using Value.data directly here because we don't want to update the gradient
        this.runningMean.forEach((runningMean, i) => {
            const weightedPrevMean = runningMean.data * (1 - this.momentum)
            const weightedNewMean = means[i].data * this.momentum
            runningMean.data = weightedPrevMean + weightedNewMean
        })
    }

    _updateRunningVariance(variances: Value[]) {
        // using Value.data directly here because we don't want to update the gradient
        this.runningVariance.forEach((runningVariance, i) => {
            const weightedPrevVariance = runningVariance.data * (1 - this.momentum)
            const weightedNewVariance = variances[i].data * this.momentum
            runningVariance.data = weightedPrevVariance + weightedNewVariance;
        })
    }

    _calcMeans(inputBatch: Value[][]) {
        return inputBatch.reduce((acc, input) => {
            return acc.map((mean, i) => mean.plus(input[i].divide(inputBatch.length)))
        }, this.runningMean)
    }

    _calcVariances(inputBatch: Value[][], means: Value[]) {
        return inputBatch.reduce((acc, input) => {
            return acc.map((variance, i) => {
                const diff = input[i].minus(means[i])
                return variance.plus(diff.times(diff).divide(inputBatch.length))
            })
        }, this.runningVariance)
    }

    _evalForward(inputBatch: Value[][]) {
        return this._shift(inputBatch, this.runningMean, this.runningVariance)
    }

    _shift(inputBatch: Value[][], mean: Value[], variance: Value[]) {
        return inputBatch.map((input) => {
            return input.map((x, i) => {
                const xhat = x.minus(mean[i])
                    .divide(
                        (variance[i].plus(this.epsilon)).sqrt()
                    );
                return xhat.times(this.gamma[i]).plus(this.beta[i]);
            })
        
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
    };
    
}