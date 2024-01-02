"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequential = void 0;
class Sequential {
    constructor(layers = []) {
        this.layers = layers;
        this._train = true;
    }
    eval() {
        this._train = false;
        this.layers.forEach(l => l.eval());
    }
    train() {
        this._train = true;
        this.layers.forEach(l => l.train());
    }
    get isTrain() {
        return this._train;
    }
    get isEval() {
        return !this._train;
    }
    addLayer(layer) {
        this.layers.push(layer);
    }
    forward(inputs) {
        let inns = inputs;
        let outs = []; // fix this - was done for typing
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
exports.Sequential = Sequential;
