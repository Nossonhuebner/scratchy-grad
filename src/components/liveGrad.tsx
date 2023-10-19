import { useReducer, useState } from "react";
import { Ops, Value } from "../util/engine"
import { Stack, Button, TextField, Divider, Grid} from "@mui/material";
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

        // there will be intermediary '_parents' used to build the graph, but this leads to a bug where the arrows try pointing to them when they dont exist as Value Nodes on the DOM. 
        // introducing the selectedNodes as 'displayContributors' instead of just using _parents resolves this
        result.displayContributors = selectedNodes
        setSelectNodes([])
        setCanBackProps(true);
        setNodes([...nodes, result]);
    }

    const relu = () => {
        const results = selectedNodes.map(n => {
            const result = n.relu();
            result.displayContributors = [n]
            return result;
        })
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

    const keyHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const validInput = inputVal && !isNaN(Number(inputVal))
        if (e.key === 'Enter' && validInput) {
            addNode();
        }
    }
    return (
        <Stack direction="row">
            <Stack className="liveGradInput">
                <TextField type="text" variant="filled" onChange={(e) => setInputVal(e.target.value)} value={inputVal} onKeyDown={keyHandler}/>
                <Button onClick={addNode} disabled={!inputVal || isNaN(Number(inputVal))}>Add node</Button>
                <Divider/>
                <Grid container>
                    <Grid item xs={6}><Button disabled={selectedNodes.length == 0} onClick={relu}>ReLU</Button></Grid>
                    <Grid item xs={6}><Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Plus)}>+</Button></Grid>
                    <Grid item xs={6}><Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Minus)}>-</Button></Grid>
                    <Grid item xs={6}><Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Times)}>*</Button></Grid>
                    <Grid item xs={6}><Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Divided)}>/</Button></Grid>
                    {/* <Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.)}>SQRT</Button> */}
                    {/* <Button disabled={selectedNodes.length < 2} onClick={() => operate(Ops.Plus)}>^2</Button> */}
                </Grid>
                <Divider/>
                <Grid container>
                <Grid item xs={6}><Button disabled={!canBackProp} onClick={backprop}>Back!</Button></Grid>
                <Grid item xs={6}><Button disabled={nodes.length == 0} onClick={zero}>zero grad</Button></Grid>
                </Grid>
            </Stack>
            <Graph nodes={nodes} selectedNodes={selectedNodes} toggleSelectNode={toggleSelectNode}/>
        </Stack>
    )
}