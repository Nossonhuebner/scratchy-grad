import mnist from 'mnist';
import { useRef, useEffect } from 'react';

type Props = {
    digit: number[];
    label: number;
    preds?: number[];
    loss?: number;
}

function topNIdx(arr: number[], n: number) {
    const copy = arr.slice(0);
    const idxs = [];
    for (let i = 0; i < n; i++) {
        const max = Math.max(...copy)
        const idx = copy.indexOf(max);
        idxs.push(idx);
        copy[idx] = -Infinity
    }

    return idxs;
}

function DigitPreview({ digit, label, preds, loss }: Props) {
    const mnistRef = useRef<HTMLCanvasElement>(null)
    const topPredIdx = preds ? topNIdx(preds, 3) : null;
    const topPreds = topPredIdx && preds ? [preds[topPredIdx[0]], preds[topPredIdx[1]], preds[topPredIdx[2]]] : []
    useEffect(() => {
        if (mnistRef.current) {
            const context = mnistRef.current.getContext('2d')
            if (context) {
                mnist.draw(digit, context, 100, 100);
            }
        }

    }, []);

    return (
        <div>
            <canvas ref={mnistRef} />
            {loss && (<div>{loss}</div>)}
            {topPreds.map(p => {
                <
            })}
        </div>
    )

}