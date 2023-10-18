import { Value } from "../util/engine"
import Draggable from "react-draggable";
import {useXarrow} from 'react-xarrows';


type Props = {
    node: Value;
    selectNode: (v: Value) => void;
    selected: boolean;
}
export function ValueNode({node, selectNode, selected}: Props) {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <button id={node.id} style={{outline: 'none', border: '1px solid', borderRadius: "5px", borderColor: selected ? 'red' : 'blue', margin: '5px'}} onClick={() => selectNode(node)}>
                <div>data: {node.data}</div>
                {/* <div>{node.op}</div> */}
                <div style={{color: 'red'}}>grad: {node.grad}</div>
            </button>
        </Draggable>
    )
}

export function OpNode({op, id}: {op: string, id: string}) {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
        <div style={{background: 'green', width: '25px',padding: '15px',borderRadius: '50%', height: '25px',}}  id={id}>
            {op}
        </div>
        </Draggable>

    )
}