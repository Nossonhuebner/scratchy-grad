import { Datum } from 'mnist';
import { useState, useEffect, useRef } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import Chart from './chart'
import DigitPreview from './digitPreview';

export type ImageItem = Datum & { loss?: number, preds?: number[], id: string }
type ImageDataSet = {
    training: ImageItem[],
    test: ImageItem[],
}

function Mnist() {
    const [accuracy, setAccuracy] = useState<number[]>([]);
    const [loss, setLoss] = useState<number[]>([])
    const [, setDataset] = useState<ImageDataSet>({ training: [], test: [] })
    const [epocs, setEpocs] = useState(10)
    const [batchSize, setBatchSize] = useState(60)
    const [lr, setLr] = useState<number>(0.001)
    const [isTraining, setIsTraining] = useState(false);
    const workerRef = useRef<Worker | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [previewItems, setPreviewItems] = useState<ImageItem[]>([]);
    const MAX_PREVIEW_ITEMS = 20; // Adjust this number based on performance

    useEffect(() => {
        console.log('Initializing Web Worker');
        workerRef.current = new Worker(new URL('./mnist.worker.ts', import.meta.url), {
            type: 'module'
        });
        workerRef.current.onmessage = (event) => {
            const { type, data } = event.data;
            console.log('Received message from worker:', type);
            switch (type) {
                case 'EPOCH_RESULT':
                    console.log('Epoch result:', data);
                    setLoss(prevLoss => [...prevLoss, data.loss]);
                    setAccuracy(prevAccuracy => [...prevAccuracy, data.accuracy]);
                    setDataset(data.dataset);
                    renderDigits(data.dataset);
                    updatePreviewItems(data.dataset);
                    break;
                case 'TRAINING_COMPLETE':
                    console.log('Training complete');
                    setIsTraining(false);
                    break;
                case 'ERROR':
                    console.error('Error in worker:', data);
                    setIsTraining(false);
                    break;
            }
        };

        return () => {
            console.log('Terminating Web Worker');
            workerRef.current?.terminate();
        };
    }, []);

    function startTraining() {
        console.log('Starting training with params:', { epocs, batchSize, lr });
        setIsTraining(true);
        setLoss([]);
        setAccuracy([]);
        workerRef.current?.postMessage({
            type: 'START_TRAINING',
            data: { epocs, batchSize, lr }
        });
    }

    function renderDigits(dataset: ImageDataSet) {
        console.log('Rendering digits');
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const size = 28;
        const padding = 2;
        const cols = 10;

        dataset.test.forEach((item, index) => {
            const x = (index % cols) * (size + padding);
            const y = Math.floor(index / cols) * (size + padding);
            for (let i = 0; i < 28; i++) {
                for (let j = 0; j < 28; j++) {
                    const value = item.input[i * 28 + j] * 255;
                    ctx.fillStyle = `rgb(${value},${value},${value})`;
                    ctx.fillRect(x + j, y + i, 1, 1);
                }
            }
        });
    }

    function updatePreviewItems(dataset: ImageDataSet) {
        const getRandomSubset = (array: ImageItem[], count: number) => {
            const shuffled = array.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        const newPreviewItems = [
            ...getRandomSubset(dataset.test, MAX_PREVIEW_ITEMS / 2),
            ...getRandomSubset(dataset.training, MAX_PREVIEW_ITEMS / 2)
        ];
        setPreviewItems(newPreviewItems);
    }

    return (
        <div>
            <h1>Mnist</h1>
            <TextField label="#Epocs" variant="outlined" type="number" value={epocs} onChange={(e) => setEpocs(parseInt(e.currentTarget.value))} />
            <TextField label="Batch size" variant="outlined" type="number" value={batchSize} onChange={(e) => setBatchSize(parseInt(e.currentTarget.value))} />
            <TextField label="Learning rate" variant="outlined" type="number" value={lr} onChange={(e) => setLr(parseFloat(e.currentTarget.value))} />
            <Button onClick={startTraining} disabled={isTraining}>
                {isTraining ? 'Training...' : 'Train'}
            </Button>

            <Stack direction="row" className="resultsContainer">
                <Chart data={accuracy} label="Accuracy" color="def not red lol" />
                <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', maxWidth: '60%'}}>
                    {previewItems.slice(0, 10).map(item => (
                        <DigitPreview key={item.id} item={item} />
                    ))}
                </div>
            </Stack>

            <Stack direction="row" className="resultsContainer">
                <Chart data={loss} label="Loss" color="red" />
                {previewItems.slice(10).map(item => (
                        <DigitPreview key={item.id} item={item} />
                    ))}
            </Stack>
        </div>
    )
}

export default Mnist;