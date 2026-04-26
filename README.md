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


### Regrets
- While React does allow some shortcuts and usage of libraries such as MUI, it was probably not the tool for this since the processing is heavy as it is without additional React overhead. In addition I had to manually disable to React batching updates since otherwise it would be "smart" and wait until the entire training process was complete to update the DOM.

#### TODO
- [x] Refactor the model API towards pytorch's (explicitly passing in layers, optimizer object...)
- [x] Export autograd + MLP wrapper as a package
- Determine fix for adding more than one layer - currently multiple layers result in exploding gradients
  - [x] Implement Batch Normalization
  - [ ] Ensure gradients are healthy looking
- [ ] Add Embedding layer


## Appendix: LLM-assisted follow-ups

A log of changes worked through with Claude Code, linked to the commit that landed them.

- [`6281ea9`](https://github.com/Nossonhuebner/scratchy-grad/commit/6281ea98990bf6f093c5475c6016b7287c277a44) — **Fan-in-aware weight init + first test suite.** Replaced `Neuron`'s uniform `Math.random()` fallback with a Gaussian fan-in-aware default (`N(0, 1/√fan_in)`), and added an optional `'he'` init mode to `Linear` for ReLU-friendly deeper nets. Set up vitest and added tests checking that the empirical stddev of sampled weights matches the theoretical target across Glorot, He, and explicit-scale paths.
- [`cf43616`](https://github.com/Nossonhuebner/scratchy-grad/commit/cf436164b11618cdcc3dded3e402fd15943ed853) — **Unblock GH Pages deploy off deprecated `upload-artifact@v3`.** The Pages workflow was failing because `actions/upload-pages-artifact@v1` transitively pulled in `upload-artifact@v3`. Bumped the Pages action chain (`configure-pages` v3→v4, `upload-pages-artifact` v1→v3, `deploy-pages` v1→v4).
