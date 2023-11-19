import { Card, Stack } from '@mui/material';
import mnist from 'mnist';
import { useRef, useEffect } from 'react';
import { ImageItem } from './mnist'

function topNIdx(arr: number[], n: number) {
    const copy = arr.slice(0);
    copy.sort((a, b) => b - a )
    const idxs: number[] = [];
    for (let i = 0; i < Math.min(n, copy.length); i++) {
        idxs.push(arr.indexOf(copy[i]))
    }
    return idxs;
}


function DigitPreview({item}: {item: ImageItem}) {
    const { input, output, preds, loss, id } = item;
    const label = output.indexOf(1);
    const mnistRef = useRef<HTMLCanvasElement>(null)
    const topPredIdx = preds ? topNIdx(preds, 3) : null;

    useEffect(() => {
        if (mnistRef.current) {
            const context = mnistRef.current.getContext('2d')
            if (context) {
                mnist.draw(input, context, 0, 0);
            }
        }
    }, [input, id]);

    return (
        <Card style={{height: 'fit-content', margin: '10px'}}>
            <Stack direction="row" style={{width: 'fit-content'}}>
                <canvas ref={mnistRef} height="28" width="28" className="digitCanvas"/>
                <div style={{width: '80px', fontSize: '12px'}}>
                    {loss && (<div>{loss.toFixed(5)}</div>)}
                    {preds && topPredIdx?.map(pIdx => {
                        const color = pIdx == label ? 'green' : 'red';
                        return (
                            <div style={{background: `linear-gradient(90deg, ${color} 0%, rgba(255,255,255,1) ${preds[pIdx]*100}%)`}}>
                                <Stack direction="row" justifyContent="space-between">
                                    <strong>{pIdx}:</strong>
                                    -
                                    <div>{preds[pIdx].toFixed(4)}</div>
                                </Stack>
                            </div>
                        )
                    })}
                </div>
            </Stack>
        </Card>
    )

}

export default DigitPreview;