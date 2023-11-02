import { Value } from "./engine";

export class Neuron {
    weights: Value[];
    bias: Value;
    nonLinear: boolean;
    
    constructor(nInputs: number, nonLinear: boolean) {
        this.weights  = []
        for (let i = 0; i < nInputs; i++) {
            this.weights.push(new Value(Math.random()));
        }
        this.bias = new Value(Math.random());
        this.nonLinear = nonLinear;
    }

    forward(inputs: (Value | number)[]) {
        let sum = new Value(0);
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

export class Layer {
    neurons: Neuron[];
    constructor(nInputs: number, nOutputs: number, nonLinear: boolean) {
        this.neurons = [];
        for (let i = 0; i < nOutputs; i++) {
            this.neurons.push(new Neuron(nInputs, nonLinear));
        }   1
    }

    forward(inputs: (Value | number)[]) {
        return this.neurons.map(neuron => neuron.forward(inputs));
    }

    get parameters() {
        return this.neurons.map(neuron => neuron.parameters).flat();
    }
}

export class MLP {
    layers: Layer[];
    constructor(nInputs: number, nOutputs: number[]) {
        this.layers = [];
        const layerConfig = [nInputs, ...nOutputs];
        for (let i = 0; i < layerConfig.length-1; i++) {
            const nIn = layerConfig[i];
            const nOut = layerConfig[i+1];
            const nonLinear = i < layerConfig.length-2;
            this.layers.push(new Layer(nIn, nOut, nonLinear));
        }
    }

    forward(inputs: (Value | number)[]): Value[] {
        let inns = inputs;
        let outs: Value[] = []; // fix this - was done for typing
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

export function softmax(values: Value[]) {
    const exps = values.map(v => v.exp())
    const sum = exps.reduce((acc, v) => acc.plus(v), new Value(0))
    return exps.map(v => v.divide(sum))
}

export function negativeLogLikelihood(probs: Value[], target: number) {
    return probs[target].log().neg()
}

window.softmax = softmax;
window.negativeLogLikelihood = negativeLogLikelihood;



function optimize(net: MLP) {
    const params = net.parameters;
    const lr = 0.01;
    for (let i = 0; i < params.length; i++) {
        params[i].data -= lr * params[i].grad;
    }

}