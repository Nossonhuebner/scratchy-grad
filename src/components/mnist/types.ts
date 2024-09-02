export interface ImageItem {
    input: number[];
    output: number[];
    loss?: number;
    preds?: number[];
    id: string;  // Changed from number to string
}

export interface ImageDataSet {
    training: ImageItem[];
    test: ImageItem[];
}