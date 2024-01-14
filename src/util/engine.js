"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = exports.Ops = exports.asValue = void 0;
function asValue(val) {
    return typeof val === 'number' ? new Value(val) : val;
}
exports.asValue = asValue;
const uniqueId = (length = 16) => {
    return Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", "");
};
var Ops;
(function (Ops) {
    Ops["Init"] = "";
    Ops["Plus"] = "+";
    Ops["Minus"] = "-";
    Ops["Times"] = "x";
    Ops["Divided"] = "/";
    Ops["Pow"] = "**";
    Ops["Sqrt"] = "\u221A";
    Ops["ReLU"] = "ReLU";
    Ops["Exp"] = "Exp";
    Ops["Log"] = "Log";
})(Ops || (exports.Ops = Ops = {}));
class Value {
    constructor(data, parents = [], op = Ops.Init) {
        this._back = () => { };
        this.displayContributors = [];
        this.data = data;
        this._parents = parents;
        this.op = op;
        this.grad = 0.0;
        this.id = uniqueId();
    }
    plus(other) {
        const x = asValue(other);
        const result = new Value(x.data + this.data, [this, x], Ops.Plus);
        result._back = () => {
            x.grad += result.grad;
            this.grad += result.grad;
        };
        return result;
    }
    minus(other) {
        const x = asValue(other);
        const result = new Value(this.data - x.data, [this, x], Ops.Minus);
        result._back = () => {
            this.grad += result.grad;
            x.grad += -(result.grad);
        };
        return result;
    }
    times(other) {
        const x = asValue(other);
        const result = new Value(x.data * this.data, [this, x], Ops.Times);
        result._back = () => {
            x.grad += this.data * result.grad;
            this.grad += x.data * result.grad;
        };
        return result;
    }
    divide(other) {
        ;
        const x = asValue(other);
        const result = new Value(this.data / x.data, [this, x], Ops.Divided);
        result._back = () => {
            this.grad += (1 / x.data) * result.grad;
            x.grad += (-this.data / (x.data ** 2)) * result.grad;
        };
        return result;
    }
    pow(other) {
        const x = asValue(other);
        const result = new Value(this.data ** x.data, [this, x], Ops.Pow);
        result._back = () => {
            this.grad += (x.data * (this.data ** (x.data - 1))) * result.grad;
        };
        return result;
    }
    sqrt() {
        const sqrt = Math.sqrt(this.data);
        const result = new Value(sqrt, [this], Ops.Sqrt);
        result._back = () => {
            this.grad += (1 / (2 * sqrt)) * result.grad;
        };
        return result;
    }
    relu() {
        const result = new Value(Math.max(this.data, 0), [this], Ops.ReLU);
        result._back = () => {
            this.grad += Number(result.data > 0) * result.grad;
        };
        return result;
    }
    tanh() {
        const val = Math.tanh(this.data);
        const result = new Value(val);
        result._back = () => {
            this.grad += (1 - val ** 2) * result.grad;
        };
        return result;
    }
    exp() {
        const result = new Value(Math.exp(this.data), [this], Ops.Exp);
        result._back = () => {
            this.grad += Math.exp(this.data) * result.grad;
        };
        return result;
    }
    log() {
        const result = new Value(Math.log(this.data), [this], Ops.Log);
        result._back = () => {
            this.grad += (1 / this.data) * result.grad;
        };
        return result;
    }
    neg() {
        return this.times(-1);
    }
    backward() {
        this.grad = 1;
        const sorted = this._topologicalSortParents();
        sorted.reverse().forEach(v => v._back());
    }
    negativeLogLikelihood() {
        return this.nll();
    }
    nll() {
        return this.log().neg();
    }
    toString() {
        return `[Value] data: ${this.data}, op: '${this.op}', grad: ${this.grad}`;
    }
    _topologicalSortParents(sorted = [], seen = new Set()) {
        if (!seen.has(this)) {
            seen.add(this);
        }
        this._parents.forEach(v => v._topologicalSortParents(sorted, seen));
        sorted.push(this);
        return sorted;
    }
}
exports.Value = Value;
