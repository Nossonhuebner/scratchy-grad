import { useReducer, useState } from "react";
import { Ops, Value } from "../util/engine"
import { Stack, Box, Button} from "@mui/material";
import { Graph } from "./graph";


export function LiveGrad() {
    const [nodes, setNodes] = useState<Value[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [selectedNodes, setSelectNodes] = useState<Value[]>([]);
    const [canBackProp, setCanBackProps] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const addNode = () => {
        const val = new Value(Number(inputVal), [], Ops.Init);
        setNodes([...nodes, val]);
        setInputVal('')
    }


    const operate = (op: Ops) => {
        const result = selectedNodes.reduce((acc, cur) => {
            switch (op) {
                case Ops.Times:
                    return acc.times(cur)
                case Ops.Minus:
                    return acc.minus(cur)
                case Ops.Pow:
                    return acc.pow(cur)
                case Ops.Divided:
                    return acc.divide(cur)
                case Ops.Plus:
                default:
                    return acc.plus(cur)
            }
        })

        result.displayContributors = selectedNodes
        setSelectNodes([])
        setCanBackProps(true);
        setNodes([...nodes, result]);
    }

    const relu = () => {
        const results = selectedNodes.map(n => n.relu())
        setSelectNodes([])
        setCanBackProps(true);
        setNodes([...nodes, ...results]);
    }

    const toggleSelectNode = (n: Value) => {
        const newState = selectedNodes.includes(n) ? selectedNodes.filter(node => node != n) : [...selectedNodes, n]
        setSelectNodes(newState);
    }

    const backprop = () => {
        const leaf = nodes.findLast(n => n.op !== Ops.Init)
        if (!leaf) return;

        leaf.backward();
        forceUpdate();
    }
    const zero = () => {
        nodes.forEach(n => n.grad = 0)
        forceUpdate();
    }
    return (
        <Stack direction="row">
            <Stack className="inputButtons">
                <input type="text" onChange={(e) => setInputVal(e.target.value)} value={inputVal}/>
                <Button onClick={addNode} disabled={!inputVal || isNaN(Number(inputVal))}>Add node</Button>
                <Button disabled={selectedNodes.length == 0} onClick={relu}>ReLU</Button>
                <Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Plus)}>+</Button>
                <Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Minus)}>-</Button>
                <Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Times)}>*</Button>
                <Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Divided)}>/</Button>
                {/* <Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.)}>SQRT</Button> */}
                {/* <Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Plus)}>^2</Button> */}
                <Button disabled={!canBackProp} onClick={backprop}>Back!</Button>
                <Button disabled={nodes.length == 0} onClick={zero}>zero grad</Button>
            </Stack>
            <Graph nodes={nodes} selectedNodes={selectedNodes} toggleSelectNode={toggleSelectNode}/>
        </Stack>
    )
}