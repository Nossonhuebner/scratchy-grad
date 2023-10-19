import { useReducer, useState } from "react";
import { OpNode, ValueNode } from "./node";
import { Ops, Value } from "../util/engine"
import Xarrow, { Xwrapper } from "react-xarrows";


export function Graph() {
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
    return (
        <>
            <input type="text" onChange={(e) => setInputVal(e.target.value)} value={inputVal}/>
            <button onClick={addNode} disabled={!inputVal || isNaN(Number(inputVal))}>Add node</button>
            <Xwrapper>
                {nodes.map((n, i)=> {
                    return (
                        <>
                        <ValueNode node={n} key={n.id} selectNode={toggleSelectNode} selected={selectedNodes.includes(n)}/>

                        {n.op && (
                            <>
                                <OpNode op={n.op} key={`${n.id}-{op}`} id={`${n.id}-${n.op}-${i}`}/>
                                {n.displayContributors.map(p =>  {
                                    return <Xarrow start={p.id} end={`${n.id}-${n.op}-${i}`}/>
                                })}
                                <Xarrow lineColor="green" headColor="green" start={`${n.id}-${n.op}-${i}`} end={n.id}/>
                            </>
                        )}
                    </>
                    )
                })}
            </Xwrapper>
            {selectedNodes.length > 0 && <button onClick={relu}>ReLU</button>}
            {selectedNodes.length > 1 && (
                <>
                    <button onClick={() => operate(Ops.Plus)}>+</button>
                    <button onClick={() => operate(Ops.Minus)}>-</button>
                    <button onClick={() => operate(Ops.Times)}>*</button>
                    <button onClick={() => operate(Ops.Divided)}>/</button>
                    {/* <button onClick={() => operate(Ops.)}>SQRT</button> */}
                    {/* <button onClick={() => operate(Ops.Plus)}>^2</button> */}
            </>
            )}
            <br/>
            {canBackProp && (
                <button onClick={backprop}>Back!</button>
            )}
            </>
    )
}