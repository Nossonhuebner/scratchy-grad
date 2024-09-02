import { Card } from '@mui/material';
import { useRef, useEffect } from 'react';
import { ImageItem } from './types';

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
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                // Draw digit
                for (let i = 0; i < 28; i++) {
                    for (let j = 0; j < 28; j++) {
                        const value = input[i * 28 + j] * 255;
                        ctx.fillStyle = `rgb(${value},${value},${value})`;
                        ctx.fillRect(j, i, 1, 1);
                    }
                }

                // Draw prediction bars
                if (preds) {
                    const maxBarWidth = 70;
                    const barHeight = 12;
                    topNIdx(preds, 5).forEach((pred, idx) => {
                        const color = pred === label ? 'green' : 'red';
                        ctx.fillStyle = color;
                        ctx.fillRect(30, idx * (barHeight + 3), maxBarWidth * preds[pred], barHeight);
                        ctx.fillStyle = 'black';
                        ctx.font = '12px Arial';
                        ctx.textAlign = 'left';
                        ctx.fillText(`${pred}: ${preds[pred].toFixed(2)}`, 32, idx * (barHeight + 3) + 10);
                    });
                }

                // Draw loss if available
                if (loss !== undefined) {
                    ctx.fillStyle = 'black';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Loss: ${loss.toFixed(5)}`, 65, 115);
                }
            }
        }
    }, [input, preds, loss, label, id]);

    return (
        <Card style={{
            width: 'fit-content',
            margin: '5px',
            padding: '2px',
            display: 'inline-block'
        }}>
            <canvas ref={canvasRef} width={100} height={120} />
        </Card>
    );
}

export default DigitPreview;