import mnist from 'mnist';
import { useEffect, useRef } from 'react';
import { MLP } from '../util/nn';

declare global {
    interface Window {
        asdf: any;
        net: any;
        softmax: any;
        negativeLogLikelihood: any;
    }
}

function Mnist() {
    const set = mnist.set(2, 2);
    window.asdf = set;
    var digit = mnist[1].get();

    const ref = useRef<HTMLCanvasElement>(null)

    const net = new MLP(28*28, [10]);
    window.net = net;
    // useEffect(() => {
    //   if (ref.current) {
    //     const context = ref.current.getContext('2d')
    //     if (context) {
    //         mnist.draw(digit, context, 100, 100);

    //     }
    //   }
    // }, []);

    return (
        <div>
        <h1>Mnist</h1>
        <canvas ref={ref} />

        </div>
    );
}

export default Mnist;