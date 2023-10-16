import { useState } from "react";
import { Nodde } from "./node";
import { Ops, Value } from "../util/engine"
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';

export function Graph() {
    const [nodes, setNodes] = useState<Value[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [selectedNodes, setSelectNodes] = useState<Value[]>([]);
    const [canBackProp, setCanBackProps] = useState(false);

    const addNode = () => {
        const val = new Value(Number(inputVal), Ops.Init)
        setNodes([...nodes, val])
        setInputVal('')
    }

    const operate = (op: Ops) => {
        const result = selectedNodes.reduce((acc, cur) => {
            return acc.plus(cur)
        })
        setSelectNodes([])
        setCanBackProps(true);
        setNodes([...nodes, result]);
    }

    const toggleSelectNode = (n: Value) => {
        const newState = selectedNodes.includes(n) ? selectedNodes.filter(node => node == n) : [...selectedNodes, n]
        setSelectNodes(newState);
    }

    const backprop = () => {
        const leaf = nodes.reverse().find(n => n.op !== Ops.Init)
        if (!leaf) return;

        leaf.backward();
    }
    return (
        <div>
            <input type="text" onChange={(e) => setInputVal(e.target.value)} value={inputVal}/>
            <br/>

            <button onClick={addNode}>click</button>
            <br/>

            {nodes.map((n, idx) => <Nodde node={n} key={idx} selectNode={toggleSelectNode} selected={selectedNodes.includes(n)}/>)}
            <br/>

            {selectedNodes.length > 1 && (
                <ul>
                    <button onClick={() => operate(Ops.Plus)}>+</button>
                    <button onClick={() => operate(Ops.Minus)}>-</button>
                    <button onClick={() => operate(Ops.Times)}>*</button>
                    <button onClick={() => operate(Ops.Divided)}>/</button>
                    {/* <button onClick={() => operate(Ops.)}>SQRT</button> */}
                    {/* <button onClick={() => operate(Ops.Plus)}>^2</button> */}
                </ul>
            )}
            <br/>
            {canBackProp && (
                <button onClick={backprop}>Back!</button>
            )}
        </div>
    )
}


// const boxStyle = {
//     border: '1px #999 solid',
//     borderRadius: '10px',
//     textAlign: 'center',
//     width: '100px',
//     height: '30px',
//     color: 'black',
//     alignItems: 'center',
//     display: 'flex',
//     justifyContent: 'center',
// } as const;

// const canvasStyle = {
//     width: '100%',
//     height: '100vh',
//     background: 'white',
//     overflow: 'auto',
//     display: 'flex',
//     color: 'black',
// } as const;

// const DraggableBox = ({box}) => {
//     const updateXarrow = useXarrow();
//     return (
//         <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
//             <div id={box.id} style={{...boxStyle, position: 'absolute', left: box.x, top: box.y}}>
//                 {box.id}
//             </div>
//         </Draggable>
//     );
// };

// const SimpleTemplate = () => {
//     const box = {id: 'box1', x: 20, y: 20};
//     const box2 = {id: 'box2', x: 320, y: 120};
//     const box3 = {id: 'box3', x: 50, y: 150};
//     const box4 = {id: 'box4', x: 320, y: 220};
//     return (
//         <div style={canvasStyle} id="canvas">
//             <Xwrapper>
//                 <DraggableBox box={box}/>
//                 <DraggableBox box={box2}/>
//                 <Xarrow start={'box1'} end={'box2'}/>
//                 <Xarrow start={'box1'} end={'box2'} endAnchor={'top'}/>
//                 <Xarrow start={'box1'} end={'box2'} startAnchor={'bottom'}/>
//             </Xwrapper>
//             <Xwrapper>
//                 <DraggableBox box={box3}/>
//                 <DraggableBox box={box4}/>
//                 <Xarrow start={'box3'} end={'box4'}/>
//             </Xwrapper>
//         </div>
//     );
// };