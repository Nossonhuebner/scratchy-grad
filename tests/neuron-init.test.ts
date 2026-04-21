import { describe, test, expect } from 'vitest';
import { Neuron } from '../src/util/neuron';
import { Linear } from '../src/util/layers';

function stats(values: number[]) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    return { mean, std: Math.sqrt(variance) };
}

describe('weight initialization', () => {
    test('Neuron default init is N(0, 1/sqrt(fan_in))', () => {
        const fanIn = 100;
        const neuron = new Neuron(fanIn);
        const weights = neuron.weights.map(v => v.data);
        const { mean, std } = stats(weights);
        const expectedStd = 1 / Math.sqrt(fanIn);

        // 3-sigma bound on the sample mean of n draws from N(0, expectedStd)
        expect(Math.abs(mean)).toBeLessThan(3 * expectedStd / Math.sqrt(weights.length));
        expect(std).toBeGreaterThan(expectedStd * 0.75);
        expect(std).toBeLessThan(expectedStd * 1.25);
    });

    test('Linear Glorot (default) stddev is sqrt(2/(fan_in+fan_out))', () => {
        const fanIn = 50, fanOut = 50;
        const layer = new Linear(fanIn, fanOut);
        const weights = layer.neurons.flatMap(n => n.weights.map(v => v.data));
        const { std } = stats(weights);
        const expected = Math.sqrt(2 / (fanIn + fanOut));

        expect(std).toBeGreaterThan(expected * 0.9);
        expect(std).toBeLessThan(expected * 1.1);
    });

    test('Linear He init stddev is sqrt(2/fan_in)', () => {
        const fanIn = 100, fanOut = 50;
        const layer = new Linear(fanIn, fanOut, true, 'he');
        const weights = layer.neurons.flatMap(n => n.weights.map(v => v.data));
        const { std } = stats(weights);
        const expected = Math.sqrt(2 / fanIn);

        expect(std).toBeGreaterThan(expected * 0.9);
        expect(std).toBeLessThan(expected * 1.1);
    });

    test('explicit scale overrides fan-in default', () => {
        const fanIn = 200;
        const explicitScale = 0.05;
        const neuron = new Neuron(fanIn, explicitScale);
        const weights = neuron.weights.map(v => v.data);
        const { std } = stats(weights);

        expect(std).toBeGreaterThan(explicitScale * 0.85);
        expect(std).toBeLessThan(explicitScale * 1.15);
    });
});
