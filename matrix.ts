class OneDTensor {
    [n: number]: number
    constructor(init: number[]) {
        for (let i = 0; i < init.length; i++) {
            this[i] = structuredClone(init[i]);
        }
    }


    get(pos: number[], defaultVal?: number | undefined) {
        return this[pos[0]] || defaultVal;
    }
}


class TwoDTensor {
    shape: number[]
    [n: number]: OneDTensor
    constructor(init: number[][]) {
        this.shape = [init.length, init[0].length]
        for (let i = 0; i < init.length; i++) {
            this[i] = new OneDTensor(structuredClone(init[i]));
        }
    }

    get(pos: number[], defaultVal?: number | undefined) {
        let val: OneDTensor | number | undefined;
        const [d1, d2] = pos;
        val = this[d1]
        if (d2) {
            val = val.get([d2], defaultVal)
        }
        return val || defaultVal;
    }


}

class Tensor {
    [n: number]: OneDTensor | number
    t: OneDTensor | TwoDTensor;
    constructor(init: number[][] | number[] | number) {
        let t: OneDTensor | TwoDTensor;
        if (typeof init === "number") {
            t = new OneDTensor([init])
        } else if (typeof init[0] === "number") {
            t = new OneDTensor(init as number[] )
        } else {
            t = new TwoDTensor(init as number[][])
        }
        this.t = t;
    }

    
    get(pos: number[], defaultVal?: number | undefined) {
        return this.t.get(pos, defaultVal);
    } 
}

console.log(new Tensor(1))
console.log(new Tensor([1, 2, 3]))
console.log(new Tensor([[1, 2, 3], [4, 5, 6]]))


console.log(new Tensor(1))
console.log(new Tensor([1, 2, 3]).get([1]))
console.log(new Tensor([[1, 2, 3], [4, 5, 6]]).get([1, 1]))