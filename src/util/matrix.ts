
// function nestedDimsEqual(tensor: any[] | number): boolean {
//     if (typeof tensor === 'number') {
//         return true;
//     }
//     const matching = tensor.every(t => t.length == tensor[0].length)
//     if (!matching) return false;

//     return tensor.every(t => nestedDimsEqual(t))
// }

// class Value {
//     data: number
//     grad: number | null
//     _backward: () => void;
//     constructor(data: number) {
//         this.data = data;
//         this.grad = null;
//         this._backward = () => {}
        
//     }
// }

// class Tensor {
//     [n: number]: Tensor
//     _items?: Tensor[]
//     _item?: number
//     constructor(init: any[] | number) {

//         if (typeof init === "number") {
//             this._item = init
//         } else {

//             if (!nestedDimsEqual(init)) {
//                 throw new Error('dims do not match')
//             }

//             this._items = []
//             for(let i = 0; i < init.length; i++) {
//                 this._items.push(new Tensor(init[i]))
//             }
//         }
//     }

//     item() {
//         return this._item
//     }

//     toString() {
//         if (this._item) {
//             return this._item.toString()
//         }

//         if (this._items) {
//             return `[
//                 ${this._items.forEach(i => {
//                     i.toString();
//                 })}
//             ],`
            
//         }
//     }

    
//     get(pos: number[], defaultVal?: number | undefined): Tensor | number | undefined{
//         const thisDim = pos[0];
//         if (!this._items || thisDim >= this._items.length) {
//             if (defaultVal) {
//                 return defaultVal
//             }
//             throw new Error(`out of range: ${JSON.stringify(pos)}`)
//         }
//         const target = this._items[thisDim];
//         const nextDims = pos.slice(1);
//         if (nextDims.length) {
//             return target.get(nextDims, defaultVal)
//         }
//         return target;
//     }

//     shape(): number[] {
//        if (this._item) {
//         return [];
//        }

//        if (!this._items) {
//         return [];
//        }

//        return [this._items.length, ...this._items[0].shape()].filter(x => !!x)
//     }
// }

// console.log(new Tensor(1))
// console.log(new Tensor([1, 2, 3]))
// console.log(new Tensor([[1, 2, 3], [4, 5, 6]]))


// console.log(new Tensor(1).item())
// console.log(new Tensor([1, 2, 3]).get([1]))
// console.log(new Tensor([[1, 2, 3], [4, 5, 6]]).get([1, 1]))