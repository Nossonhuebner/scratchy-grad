import { Card, Stack } from '@mui/material';
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
    copy.sort().reverse();
    const idxs: number[] = [];
    for (let i = 0; i < Math.max(n, copy.length); i++) {
        idxs.push(arr.indexOf(copy[i]))
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
                mnist.draw(digit, context, 0, 0);
            }
        }
    }, []);

    return (
        <Card>
            <Stack direction="row" style={{width: 'fit-content'}}>
                <canvas ref={mnistRef} height="28" width="28" className="digitCanvas"/>
                <div>
                    <div>{label}</div>
                    {loss && (<div>{loss}</div>)}
                    {topPreds.map(p => {
                        return <div>{p}</div>
                    })}
                </div>
            </Stack>
        </Card>
    )

}

export default DigitPreview;