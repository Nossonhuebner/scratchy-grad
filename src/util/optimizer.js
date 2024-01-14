"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SGD = void 0;
class SGD {
    constructor(parameters, lr, maxGrad, minGrad) {
        this.parameters = parameters;
        this.lr = lr;
        this.maxGrad = maxGrad || Infinity;
        this.minGrad = minGrad || -Infinity;
    }
    zeroGrad() {
        this.parameters.forEach(p => p.grad = 0);
    }
    step() {
        this.parameters.forEach(p => p.data += -this.lr * this.clipGradient(p.grad));
    }
    clipGradient(grad) {
        const upperLimit = Math.min(this.maxGrad, grad);
        return Math.max(upperLimit, this.minGrad);
    }
}
exports.SGD = SGD;
