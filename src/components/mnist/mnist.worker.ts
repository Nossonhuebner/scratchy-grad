import { ImageItem, ImageDataSet } from './types';
import mnist from 'mnist';

let net: any;
let optimizer: any;
let scratchyGrad: any;

async function initializeScratchyGrad() {
    scratchyGrad = await import('scratchy-grad');
    const { Sequential, Linear, SGD } = scratchyGrad;
    net = new Sequential([new Linear(28 * 28, 10)]);
    optimizer = new SGD(net.parameters, 0.001); // default learning rate
}

self.onmessage = async (event: MessageEvent) => {
    const { type, data } = event.data;
    console.log('Worker received message:', type);
    if (type === 'START_TRAINING') {
        const { epocs, batchSize, lr } = data;
        await initializeScratchyGrad();
        startTraining(epocs, batchSize, lr);
    }
};

function startTraining(epocs: number, batchSize: number, lr: number) {
    try {
        console.log('Starting training in worker:', { epocs, batchSize, lr });
        optimizer = new scratchyGrad.SGD(net.parameters, lr);

        const dataset = getData(batchSize);
        console.log('Dataset created:', { trainingSize: dataset.training.length, testSize: dataset.test.length });

        for (let i = 0; i < epocs; i++) {
            console.log(`Starting epoch ${i + 1}`);
            const loss = train(net, optimizer, dataset.training);
            const accuracy = valid(net, dataset.test);
            console.log(`Epoch ${i + 1} results:`, { loss, accuracy });

            self.postMessage({
                type: 'EPOCH_RESULT',
                data: { loss, accuracy, dataset }
            });
        }

        console.log('Training complete');
        self.postMessage({ type: 'TRAINING_COMPLETE' });
    } catch (error) {
        console.error('Error in worker:', error);
        self.postMessage({ type: 'ERROR', data: (error as Error).message });
    }
}

function train(net: any, optimizer: any, training: ImageItem[]): number {
    console.log('Training started');
    net.train();

    const ins = training.map(e => e.input);
    const outs = training.map(e => e.output);

    const logt = net.forward(ins);
    const probbs = scratchyGrad.softmax(logt);
    const loss = probbs.map((p: any, i: number) => {
        const l = p[outs[i].indexOf(1)].negativeLogLikelihood();
        training[i].loss = l.data;
        return l;
    });
    const avgLoss = loss.reduce((a: any, b: any) => a.plus(b)).divide(training.length);

    optimizer.zeroGrad();
    net.parameters.forEach((p: any) => p.grad = 0);
    avgLoss.backward();
    optimizer.step();

    return avgLoss.data;
}

function valid(net: any, validation: ImageItem[]): number {
    console.log('Validation started');
    net.eval();
    const count = validation.length;
    const ins = validation.map(e => e.input);
    const outs = validation.map(e => e.output);

    const logits = net.forward(ins);
    const probs = scratchyGrad.softmax(logits);

    let accuracyCount = 0;
    probs.forEach((p: any, idx: number) => {
        const maxProbIdx = maxIdx(p);
        accuracyCount += Number(outs[idx][maxProbIdx] === 1);
        validation[idx].preds = p.map((v: any) => v.data);
    });

    const accuracy = accuracyCount / count;
    return accuracy;
}

function maxIdx(arr: any[]): number {
    let max = arr[0].data;
    let idx = 0;
    arr.forEach((v, i) => {
        if (v.data > max) {
            max = v.data;
            idx = i;
        }
    });
    return idx;
}

function getData(batchSize: number): ImageDataSet {
    console.log('Getting data with batchSize:', batchSize);
    const set = mnist.set(batchSize, Math.floor(batchSize * 0.25));
    const timestamp = Date.now();
    return {
        training: set.training.map((item: any, index: number) => ({
            ...item,
            id: `train_${timestamp}_${index}_${Math.random()}`,
            loss: undefined,
            preds: undefined
        })),
        test: set.test.map((item: any, index: number) => ({
            ...item,
            id: `test_${timestamp}_${index}_${Math.random()}`,
            loss: undefined,
            preds: undefined
        }))
    };
}

export {};
