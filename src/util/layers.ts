import { Value, asValue } from "./engine";
import { Neuron } from "./neuron";

export interface ILayer {
    forward: (inputs: (Value | number)[]) => Value[];
    readonly parameters: Value[];
    eval: () => void;
    train: () => void;
}

export class Linear implements ILayer {
    neurons: Neuron[];
    constructor(nInputs: number, nOutputs: number) {
        this.neurons = [];

        const variance = 2 / (nInputs + nOutputs);
        const scale = Math.sqrt(variance);

        for (let i = 0; i < nOutputs; i++) {
            this.neurons.push(new Neuron(nInputs, scale));
        }
    }
    eval() {}
    train() {}

    forward(inputs: (Value | number)[]) {
        return this.neurons.map(neuron => neuron.forward(inputs));
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
    forward(inputs: (number | Value)[]){
        return inputs.map(i => asValue(i).tanh())
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
    forward(encodedInputs: (number | Value)[]){
       const isn = encodedInputs as number[];
       const arr = new Array(this.nVocab)
       // TODO
        //    const oneHot = arr.map(e => )
        return []
    }
    
}