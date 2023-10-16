function asValue(val: number | Value) {
    return typeof val === 'number' ? new Value(val) : val;
}

export enum Ops {
    Init = '',
    Plus = '+',
    Minus = '-',
    Times = 'x',
    Divided = '/',
    Pow = '**',
    ReLU = 'ReLU',
}

export class Value {
    data: number;
    op: Ops;
    grad: number;
    _back = () => {}

    constructor(data: number, op: Ops = Ops.Init) {
        this.data = data;
        this.op = op;
        this.grad = 0.0;
    }

    plus(other: number | Value) {
        const x = asValue(other)
        const result = new Value(x.data + this.data, Ops.Plus)

        result._back = () => {
            x.grad += result.grad
            this.grad += result.grad
        }

        return result;
    }

    minus(other: number | Value) {
        return this.plus(asValue(other).data * -1);
    }

    times(other: number | Value) {
        const x = asValue(other)
        const result = new Value(x.data * this.data, Ops.Times)

        result._back = () => {
            x.grad += this.data * result.grad;
            this.grad += x.data * result.grad;
        }

        return result;
    }

    divide(other: number | Value) {;
        const x = asValue(other)
        const result = new Value(this.data / x.data, Ops.Divided)

        result._back = () => {
            this.grad += (1 / x.data) * result.grad;
            x.grad += (-this.data / (x.data ** 2)) * result.grad;
        }
        return result;
    }

    pow(other: number | Value) {
        const x = asValue(other);
        const result = new Value(this.data ** x.data, Ops.Pow);

        result._back = () => {
            this.grad += (x.data * (this.data ** (x.data-1))) * result.grad;
        }

        return result;
    }

    relu() {
        const result = new Value(Math.max(this.data, 0), Ops.ReLU)

        result._back = () => {
            this.grad += Number(result.data > 0) * result.grad;
        }

        return result;
    }

    backward() {
        this.grad = 1;
        this._back()
    }


    toString() {
        return `[Value] data: ${this.data}, op: '${this.op}', grad: ${this.grad}`
    }
}