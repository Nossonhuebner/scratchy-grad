declare module "mnist" {  
    export type Datum = {
      input: number[];
      output: number[];
    };
  
    interface Digit {
      id: number;
      raw: number[];
      length: number;
      get: (index?: number) => number[];
      range: (start: number, end: number) => number[][];
      set: (start: number, end: number) => Datum[];
    }
  
    namespace MNIST {
      export function set(
        trainingSetSize: number,
        testSetSize: number
      ): {
        training: Datum[];
        test: Datum[];
      };
  
      export function get(count: number): Datum[];
  
      export function draw(
        digit: number[],
        context: CanvasRenderingContext2D,
        offsetX: number,
        offsetY: number
      ): void;
  
      export function toNumber(array: number[]): number;
    }
  
    export = MNIST as typeof MNIST & Digit[];
  }