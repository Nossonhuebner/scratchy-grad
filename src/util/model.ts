import { Value } from "./engine";
import { ILayer } from "./layers";

export interface IModel {
    forward: (inputs: (Value | number)[][]) => Value[][];
    readonly parameters: Value[];
    eval: () => void;
    train: () => void;
}

export class Sequential implements IModel {
    layers: ILayer[];
    _train: boolean;

    constructor(layers: ILayer[] = []) {
        this.layers = layers;
        this._train = true;
    }

    eval() {
        this._train = false;
        this.layers.forEach(l => l.eval())
    }

    train() {
        this._train = true;
        this.layers.forEach(l => l.train())
    }

    get isTrain() {
        return this._train
    }

    get isEval() {
        return !this._train
    }

    addLayer(layer: ILayer) {
        this.layers.push(layer);
    }

    forward(inputs: (Value | number)[][]): Value[][] {
        let inns = inputs;
        let outs: Value[][] = [[]]; // fix this - was done for typing
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