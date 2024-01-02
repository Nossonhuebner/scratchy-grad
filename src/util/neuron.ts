import { Value } from "./engine";

export class Neuron {
    weights: Value[];
    bias?: Value;
    
    constructor(nInputs: number,  scale?: number, bias = true) {
        this.weights  = []
        for (let i = 0; i < nInputs; i++) {
            this.weights.push(new Value(createVal(scale)));
        }
        if (bias) {
            this.bias = new Value(0);
        }
    }

    forward(inputs: (Value | number)[]) {
        let sum = new Value(0);
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

function createVal(scale?: number) {
    return scale ? randomNormal(0, scale) : Math.random();
}

function randomNormal(mean: number, stdDev: number) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}