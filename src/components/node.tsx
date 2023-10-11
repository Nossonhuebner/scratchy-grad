import { Dispatch, SetStateAction } from "react"
import { Value } from "../util/engine"

export function Nodde({node}: {node: Value, selectNode: Dispatch<SetStateAction<Value[]>>, selected: boolean}) {
    return (
        <div style={{border: '1px blue', borderRadius: "5px"}}>
            <div>{node.data}</div>
            <div>{node.op}</div>
        </div>
    )
}