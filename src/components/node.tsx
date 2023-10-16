import { Value } from "../util/engine"


type Props = {
    node: Value;
    selectNode: (v: Value) => void;
    selected: boolean;
}
export function Nodde({node, selectNode, selected}: Props) {
    return (
        <button style={{border: '1px solid', borderRadius: "5px", borderColor: selected ? 'red' : 'blue'}} onClick={() => selectNode(node)}>
            <div>{node.data}</div>
            <div>{node.op}</div>
            {node.grad > 0 && (
             <div style={{color: 'red'}}>{node.grad}</div>
            )}
        </button>
    )
}