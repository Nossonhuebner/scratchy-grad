# ScratchyGrad
(Because it's from scratch)
#### [Live](https://nosson.me/scratchy-grad/)
#### [NPM](https://www.npmjs.com/package/scratchy-grad)


## Description
This project, inspired by [Andrej Karpathy's micrograd](https://github.com/karpathy/micrograd) and [YouTube series](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ), features an interactive autograd implementation. The autograd implementation itself is plain Typescript with no dependencies, with React + other UI libraries slapped on top for the interfaces and loading the MNIST dataset. It consists of two main components:

- Interactive Autograd Implementation: This page provides an interactive experience for users to explore the functionalities of an automatic differentiation library, based on the concepts highlighted in the micrograd series.

- MNIST Digit Prediction using MLP: Leveraging the autograd implementation, this page features a Multilayer Perceptron (MLP) model that predicts digits from the MNIST dataset. It demonstrates the practical application of the autograd system in a machine learning task.

#### Features
- Interactive Demos: Experience the workings of automatic differentiation with hands-on examples.
- MLP for Digit Recognition: Test and visualize the performance of a neural network on the MNIST dataset.


#### TODO
- [x] Refactor the model API towards pytorch's (explicitly passing in layers, optimizer object...)
- [x] Export autograd + MLP wrapper as a package
- Determine fix for adding more than one layer - currently multiple layers result in exploding gradients
  - [x] Implement Batch Normalization
  - [ ] Ensure gradients are healthy looking
- [ ] Add Embedding layer
