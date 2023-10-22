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

    forward(inputs: (Value | number)[]) {
        let outputs = inputs;
        for (let i = 0; i < this.layers.length; i++) {
            outputs = this.layers[i].forward(outputs);
        }
        return outputs;
    }

    get parameters() {
        return this.layers.map(layer => layer.parameters).flat();
    }

}


