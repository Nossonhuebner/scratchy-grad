import mnist from 'mnist';
import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        asdf: any;
    }
}

function Mnist() {
    const set = mnist.set(2, 2);
    window.asdf = set;
    var digit = mnist[1].get();

    const ref = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      if (ref.current) {
        const context = ref.current.getContext('2d')
        if (context) {
            mnist.draw(digit, context, 100, 100);

        }
      }
    }, [])
          return (
            <div>
            <h1>Mnist</h1>
            <canvas ref={ref} />
            </div>
    );
}

export default Mnist;