import mnist, { Datum } from 'mnist';
import { useMemo, useState, useEffect } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import Chart from './chart'
import DigitPreview from './digitPreview';
import { IModel, Sequential } from 'scratchy-grad/model';
import { IOptimizer, Linear, SGD, Value, softmax } from 'scratchy-grad';

export type ImageItem = Datum & { loss?: number, preds?: number[], id: number }
type ImageDataSet = {
    training: ImageItem[],
    test: ImageItem[],
}

function Mnist() {
    const [accuracy, setAccuracy] = useState<number[]>([]);
    const [loss, setLoss] = useState<number[]>([])
    const [stepCount, setStepCount] = useState(Infinity);
    const [dataset, setDataset] = useState<ImageDataSet>({ training: [], test: [] })
    const [epocs, setEpocs] = useState(10)
    const [batchSize, setBatchSize] = useState(60)
    const [lr, setLr] = useState<number>(0.001)

    const net = useMemo(() => new Sequential([
        new Linear(28 * 28, 10),
    ]), []);
    const optimizer = useMemo(() => new SGD(net.parameters, lr), [net, lr]);


    useEffect(() => { // hack to run training cycle since react was not re-rendering
        if (stepCount < epocs) {
            console.log(`epoc: ${stepCount}`)
            const set = getData(batchSize)
            setDataset(() => set)
            runEpoc(net, set.training, set.test)
            setStepCount(cur => cur + 1)
        }
    }, [stepCount, dataset])

    function runEpoc(net: IModel, training: ImageItem[], validation: ImageItem[]) {
        const l = train(net, optimizer, training);
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

function train(net: IModel, optimizer: IOptimizer, training: ImageItem[]) {
    net.train();

    const ins = training.map(e => e.input)
    const outs = training.map(e => e.output)

    const logt = net.forward(ins);
    const probbs = softmax(logt);
    const loss = probbs.map((p, i) => {
        const l = p[outs[i].indexOf(1)].negativeLogLikelihood()
        training[i].loss = l.data;
        return l;
    })
    const avgLoss = loss.reduce((a, b) => a.plus(b)).divide(training.length);

    //backward
    optimizer.zeroGrad();
    net.parameters.forEach(p => p.grad = 0);
    avgLoss.backward()
    optimizer.step();

    return avgLoss.data;
}

function valid(net: IModel, validation: ImageItem[]) {
    net.eval();
    const count = validation.length;
    const ins = validation.map(e => e.input)
    const outs = validation.map(e => e.output)

    const logits = net.forward(ins);
    const probs = softmax(logits);

    let accuratacyCount = 0
    probs.forEach((p, idx) => {
        const maxProbIdx = maxIdx(p)
        accuratacyCount += Number(outs[idx][maxProbIdx] == 1)
        validation[idx].preds = p.map(v => v.data);
        return maxIdx(p)
    });

    const accuracy = accuratacyCount / count
    console.log('accuracy:', accuracy);
    return accuracy;
}

function maxIdx(arr: Value[]) {
    let max = arr[0].data;
    let idx = 0;
    arr.forEach((v, i) => {
        if (v.data > max) {
            max = v.data;
            idx = i;
        }
    })
    return idx;
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