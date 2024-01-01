import { Button, Card} from "@mui/material";
import Draggable from "react-draggable";
import {useXarrow} from 'react-xarrows';
import { Value } from "scratchy-grad";


type Props = {
    node: Value;
    selectNode: (v: Value) => void;
    selected: boolean;
}
export function ValueNode({node, selectNode, selected}: Props) {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <Button id={node.id} style={{outline: 'none', border: '1px solid', borderRadius: "5px", borderColor: selected ? 'red' : 'blue', margin: '5px'}} onClick={() => selectNode(node)}>
                <Card style={{padding:"10px"}}>
                    <div>data: {node.data}</div>
                    <div style={{color: 'red'}}>grad: {node.grad}</div>
                </Card>
            </Button>
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