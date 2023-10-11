import { useState } from "react";
import { Nodde } from "./node";
import { Ops, Value } from "../util/engine"
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';

export function Graph() {
    const [nodes, setNodes] = useState<Value[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [operation, setOperation] = useState<Ops>(Ops.Init);
    const [selectedNodes, selectNode] = useState<Value[]>([]);

    const addNode = () => {
        const op = operation as Ops || Ops.Init
        const val = new Value(Number(inputVal), op)
        setNodes([...nodes, val])
    }
    return (
        <div>
            <input type="text" onChange={(e) => setInputVal(e.target.value)} value={inputVal}/>
            <input type="text" onChange={(e) => setOperation(e.target.value as Ops || Ops.Init)} value={operation}/>
            <button onClick={addNode}>click</button>
            Nodes
            {nodes.map((n, idx) => <Nodde node={n} key={idx} selectNode={selectNode} selected={selectedNodes.includes(n)}/>)}
        </div>
    )
}