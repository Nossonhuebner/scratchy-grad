import { Value } from "./engine";

export interface IOptimizer {
    zeroGrad: () => void;
    step: () => void;
}

export class SGD {
    parameters: Value[];
    lr: number;
    maxGrad: number;
    minGrad: number;

    constructor(parameters: Value[], lr: 0.001, maxGrad?: number, minGrad?: number) {
        this.parameters = parameters
        this.lr = lr;
        this.maxGrad = maxGrad || Infinity;
        this.minGrad = minGrad || -Infinity;
    }

    zeroGrad() {
        this.parameters.forEach(p => p.grad = 0);
    }

    step() {
        this.parameters.forEach(p => p.data += -this.lr * this.clipGradient(p.grad))
    }

    clipGradient(grad: number) {
        const upperLimit = Math.min(this.maxGrad, grad)
        return Math.max(upperLimit, this.minGrad)
    }
}