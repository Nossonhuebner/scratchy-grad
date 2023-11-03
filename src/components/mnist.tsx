import mnist, { Datum } from 'mnist';
import { useMemo, useState } from 'react';
import { MLP, softmax } from '../util/nn';
import { Button, TextField } from '@mui/material';
import Chart from './chart'


declare global {
    interface Window {
        asdf: any;
        net: any;
        softmax: any;
        negativeLogLikelihood: any;
    }
}

function Mnist() {

    // const mnistRef = useRef<HTMLCanvasElement>(null)
    // const chartRef = useRef<HTMLCanvasElement>(null)

    const net = useMemo(() => {
        return new MLP(28 * 28, [10])
    }, []);

    const [accuracy, setAccuracy] = useState<number[]>([]);
    const [loss, setLoss] = useState<number[]>([])

    const [numEpoc, setNumEpoc] = useState<number>(1);
    const [lr, setLr] = useState<number>(0.0001)

    const set = mnist.set(1, 1)

    const sett: typeof set = useMemo(() => {
        return {
        training: [],
        test: []
        }
    }, []);

    for(let i = 0; i < 10; i++) {
        const a = mnist[i].range(10, 13);
        const y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        y[i] = 1;
        const b = a.map(i => {
            return {input: i, output: y }
        })
        sett.training.push(b[0], b[1])
        sett.test.push(b[2])
    }


    const run = () => {
        runLoop(net, sett.training, sett.test, numEpoc, lr)
    }

    function runLoop(net: MLP, training: Datum[], validation: Datum[], steps: number, lr: number) {
        for(let i = 0; i < steps; i++) {
            console.log(`epoc #${i}:`)
            const l = train(net, training, lr);
            const a = valid(net, validation);
            setLoss([...loss, l])
            setAccuracy([...accuracy, a*10])
        }
    }

    window.net = net;
    // useEffect(() => {
    //     // if (mnistRef.current) {
    //     //     const context = mnistRef.current.getContext('2d')
    //     //     if (context) {
    //     //         mnist.draw(digit, context, 100, 100);

    //     //     }
    //     // }

    //     if (mnistRef.current) {
    //         if (context) {

    //         }
    //     }

    // }, []);

    return (
        <div>
            <h1>Mnist</h1>
            {/* <canvas ref={mnistRef} /> */}
            <TextField onChange={e => setLr(parseFloat(e.currentTarget.value))} value={lr} label="lr"/>
            <TextField onChange={e => setNumEpoc(parseInt(e.currentTarget.value))} value={numEpoc} label="num epoc"/>
            <Button onClick={run}>run </Button>

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


export default Mnist;