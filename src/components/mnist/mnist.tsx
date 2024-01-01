import mnist, { Datum } from 'mnist';
import { useMemo, useState, useEffect } from 'react';
import { MLP, softmax } from '../../util/nn.ts';
import { Button, Stack, TextField } from '@mui/material';
import Chart from './chart'
import { Value } from '../../util/engine.ts';
import DigitPreview from './digitPreview';

export type ImageItem = Datum & { loss?: number, preds?: number[], id: number }
type ImageDataSet = {
    training: ImageItem[],
    test: ImageItem[],
}

function Mnist() {
    const net = useMemo(() => new MLP(28 * 28, [10]), []);

    const [accuracy, setAccuracy] = useState<number[]>([]);
    const [loss, setLoss] = useState<number[]>([])
    const [stepCount, setStepCount] = useState(Infinity);
    const [dataset, setDataset] = useState<ImageDataSet>({ training: [], test: [] })
    const [epocs, setEpocs] = useState(10)
    const [batchSize, setBatchSize] = useState(60)
    const [lr, setLr] = useState(0.001)

    useEffect(() => {
        if (stepCount < epocs) {
            console.log(`epoc: ${stepCount}`)
            const set = getData(batchSize)
            setDataset(() => set)
            runEpoc(net, set.training, set.test, lr)
            setStepCount(cur => cur + 1)
        }
    }, [stepCount, dataset])

    function runEpoc(net: MLP, training: ImageItem[], validation: ImageItem[], lr: number) {
        const l = train(net, training, lr);
        const a = valid(net, validation);
        setLoss([...loss, l])
        setAccuracy([...accuracy, a])
    }

    return (
        <div>
            <h1>Mnist</h1>
            <TextField label="#Epocs" variant="outlined" type="number" value={epocs} onChange={(e) => setEpocs(parseInt(e.currentTarget.value))} />
            <TextField helperText="Note: 'BatchSize clips the entire dataset (it would run too slow over the complete set)" label="Batch size" variant="outlined" type="number" value={batchSize} onChange={(e) => setBatchSize(parseInt(e.currentTarget.value))} />
            <TextField label="Learning rate" variant="outlined" type="number" value={lr} onChange={(e) => setLr(parseFloat(e.currentTarget.value))} />
            <Button onClick={() => setStepCount(0)}>Train</Button>

            <Stack direction="row" className="resultsContainer">
                <Chart data={accuracy} label="Accuracy" color="def not red lol" />
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
                    {dataset?.test.map(testItem => (
                        <DigitPreview key={testItem.id} item={testItem} />
                    ))}
                </div>
            </Stack>

            <Stack direction="row" className="resultsContainer">
                <Chart data={loss} label="Loss" color="red" />
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
                    {dataset?.training.map(trainItem => (
                        <DigitPreview key={trainItem.id}  item={trainItem} />
                    ))}
                </div>
            </Stack>
        </div>
    )
}


function valid(net: MLP, validation: ImageItem[]) {
    const count = validation.length;
    let correct = 0;
    validation.forEach(item => {
        const { input, output } = item;

        const logits = net.forward(input);
        const probs = softmax(logits);

        const yIdx = output.indexOf(1);
        const probVals = probs.map(v => v.data);
        const maxProb = Math.max(...probVals)
        const predIdx = probVals.indexOf(maxProb);
        item.preds = probVals;
        correct += Number(yIdx == predIdx);
    })
    const accuracy = correct / count
    console.log('accuracy:', accuracy);
    return accuracy;

}

function train(net: MLP, training: ImageItem[], lr: number) {
    const count = training.length

    let aggLoss = new Value(0)
    training.forEach(item => {
        const { input, output } = item;

        // forward
        const logits = net.forward(input);
        const probs = softmax(logits);

        const loss = probs[output.indexOf(1)].negativeLogLikelihood()
        item.loss = loss.data;
        aggLoss = aggLoss.plus(loss);

    })
    //backward
    net.parameters.forEach(p => p.grad = 0);
    aggLoss = aggLoss.divide(count);
    aggLoss.backward()

    net.parameters.forEach(p => p.data += -lr * clipGradient(p.grad, -10, 10))

    // const avg =  aggLoss / count;
    console.log('avgLoss:', aggLoss.data);
    return aggLoss.data;
}

function clipGradient(grad: number, min: number, max: number) {
    if (grad < min) return min;
    if (grad > max) return max;
    return grad;

}


function getData(batchSize: number): ImageDataSet {
    const set = mnist.set(batchSize, batchSize*0.25) as ImageDataSet;
    set.training.forEach(e => {
        e.id = Math.random() * Date.now();
    })

    set.test.forEach(e => {
        e.id = Math.random() * Date.now();
    })
    return set;
}

export default Mnist;