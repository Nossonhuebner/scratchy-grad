# ScratchyGrad
(Because it's from scratch)
#### [Live](https://nosson.me/scratchy-grad/)


## Description
This project, inspired by [Andrej Karpathy's micrograd](https://github.com/karpathy/micrograd) and [YouTube series](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ), features an autograd implementation in plain Typescript with no dependencies.

#### TODO
- [x] Refactor the model API towards pytorch's (explicitly passing in layers, optimizer object...)
- [x] Export autograd + MLP wrapper as a package
- Determine fix for adding more than one layer - currently multiple layers result in exploding gradients
  - [x] Implement Batch Normalization
  - [ ] Ensure gradients are healthy looking
- [ ] Add Embedding layer



