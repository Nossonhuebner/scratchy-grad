import mnist, { Datum } from 'mnist';
import { useMemo, useState, useEffect, useRef } from 'react';
import { MLP, softmax } from '../../util/nn';
import { Button, Card, Stack } from '@mui/material';
import Chart from './chart'
import { Value } from '../../util/engine';
import DigitPreview from './digitPreview';
// import * as tf from '@tensorflow/tfjs'

declare global {
    interface Window {
        asdf: any;
        net: any;
        softmax: any;
        negativeLogLikelihood: any;
    }
}

type ImageItem = Datum & {loss?: number, preds?: number[]}
type ImageDataSet = {
    training: ImageItem[],
    test: ImageItem[],
}

function Mnist() {
    const mnistRef = useRef<HTMLCanvasElement>(null)
    const net = useMemo(() => new MLP(28 * 28, [10]), []);

    const [accuracy, setAccuracy] = useState<number[]>([]);
    const [loss, setLoss] = useState<number[]>([])
    const [stepCount, setStepCount] = useState(Infinity);
    const [dataset, setDataset] = useState<ImageDataSet>({training: [], test: []})


    // const set: {
    //     training: Datum[];
    //     test: Datum[];
    //   } = useMemo(getData, []);

    const loopSize = 10;

    useEffect(() => {
        if (stepCount < loopSize) {
            console.log(`epoc: ${stepCount}`)
            const set = getData(stepCount * 10)
            setDataset(() => set)
            runEpoc(net, set.training, set.test, 0.001)
            setStepCount(cur => cur + 1)
        }
    }, [stepCount, dataset])

    function runEpoc(net: MLP, training: ImageItem[], validation: ImageItem[], lr: number) {
        const l = train(net, training, lr);
        const a = valid(net, validation);
        setLoss([...loss, l])
        setAccuracy([...accuracy, a])
    }

    window.net = net;

    const digit = mnist[0].get(1)
    useEffect(() => {
        if (mnistRef.current) {
        const context = mnistRef.current.getContext('2d')
        if (context) {
            mnist.draw(digit, context, 0, 0);
        }
    }

    }, []);

    return (
        <div>
            <h1>Mnist</h1>
            {/* <Card>
                <Stack direction="row" style={{width: 'fit-content'}}>
                    <canvas ref={mnistRef} height="28" width="28" className="digitCanvas"/>
                </Stack>
            </Card> */}
            {/* {dataset?.training.map(trainItem => (
                <DigitPreview digit={trainItem.input} label={trainItem.output.indexOf(1)} loss={trainItem.loss}/>
            ))} */}
            {dataset?.test.map(testItem => (
                <DigitPreview digit={testItem.input} label={testItem.output.indexOf(1)} preds={testItem.preds}/>
            ))}
            <Button onClick={() => setStepCount(0)}>Train</Button>
            <Chart data={loss} label="Loss" color="red"/>
            <Chart data={accuracy} label="Accuracy" color="def not red lol"/>
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
    net.parameters.forEach(p => p.data += -lr*p.grad)

    // const avg =  aggLoss / count;
    console.log('avgLoss:',aggLoss.data);
    return aggLoss.data;
}


function getData(startIdx: number): ImageDataSet {
    // hacky way to ensure we're seeing all numbers consistantly in training + validation
    const training = [];
    const test = [];
    for(let i = 0; i < 10; i++) {
        const range = mnist[i].range(startIdx, startIdx + 6);
        const y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        y[i] = 1;
        const item = range.map(i => {
            return {input: i, output: y }
        })
        training.push(item[0], item[1], item[2], item[3])
        test.push(item[4], item[5])
    }
    return {
        training,
        test
    };
}


// async function trainTf(training: Datum[], lr: number) {
//     const model = tf.sequential({
//         layers: [
//             tf.layers.dense({inputShape: [28*28], units: 10})
//         ]
//     })
//     model.compile({loss: tf.losses.softMaxCrossEntropy, optimizer: 'sgd'});

//     const inn = tf.tensor(training.map(t => t.input))
//     const outt = tf.tensor(training.map(t => t.output))


//     await model.fit(inn, outt, {epochs: 10})

// }


export default Mnist;