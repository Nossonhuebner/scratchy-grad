import mnist, { Datum } from 'mnist';
import { useMemo, useState, useEffect, useRef } from 'react';
import { MLP, softmax } from '../util/nn';
import { Button, TextField } from '@mui/material';
import Chart from './chart'
// import * as tf from '@tensorflow/tfjs'

declare global {
    interface Window {
        asdf: any;
        net: any;
        softmax: any;
        negativeLogLikelihood: any;
    }
}

function Mnist() {
    const mnistRef = useRef<HTMLCanvasElement>(null)
    const net = useMemo(() => new MLP(28 * 28, [10]), []);

    const [accuracy, setAccuracy] = useState<number[]>([]);
    const [loss, setLoss] = useState<number[]>([])

    const set: {
        training: Datum[];
        test: Datum[];
      } = useMemo(getData, []);


    function runLoop(net: MLP, training: Datum[], validation: Datum[], steps: number, lr: number) {
        for(let i = 0; i < steps; i++) {
            console.log(`epoc #${i}:`)
            const l = train(net, training, lr);
            const a = valid(net, validation);
            setLoss([...loss, l])
            setAccuracy([...accuracy, a*10])
        }
    }

    runLoop(net, set.training, set.test, 50, 0.001)

    const a = mnist[1].get()
    a.length

    function getData() {
        // hacky way to ensure we're seeing all numbers consistantly in training + validation
        const training = [];
        const test = [];
        for(let i = 0; i < 10; i++) {
            const range = mnist[i].range(10, 15);
            const y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
            y[i] = 1;
            const item = range.map(i => {
                return {input: i, output: y }
            })
            training.push(item[0], item[1], item[2])
            test.push(item[3], item[4])
        }
        return {
            training,
            test
        };
    }

    window.net = net;

    return (
        <div>
            <h1>Mnist</h1>
            <canvas ref={mnistRef} />
            <Chart accuracy={accuracy} loss={loss}/>
        </div>
    )

}



function valid(net: MLP, validation: Datum[]) {
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
        
        correct += Number(yIdx == predIdx);
    })
    const accuracy = correct / count
    console.log('accuracy:', accuracy);
    return accuracy;

}

function train(net: MLP, training: Datum[], lr: number) {
    const count = training.length

    let aggLoss = 0
    training.forEach(item => {
        const { input, output } = item;

        // forward
        const logits = net.forward(input);
        const probs = softmax(logits);

        const loss = probs[output.indexOf(1)].negativeLogLikelihood()
        aggLoss += loss.data;

        net.parameters.forEach(p => p.grad = 0);

        loss.backward()
        net.parameters.forEach(p => p.data += -lr*p.grad)
    })
    const avg =  aggLoss / count;
    console.log('avgLoss:',avg);
    return avg;
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