import { OpNode, ValueNode } from "./node";
import { Value } from "../../util/engine"
import Xarrow, { Xwrapper } from "react-xarrows";
import { Box } from "@mui/material";


type Props = {
    nodes:Value[],
    selectedNodes: Value[],
    toggleSelectNode: (v: Value) => void;
}

function opNodeId(node: Value, i: number) {
    return `${node.id}-${node.op}-${i}`
}

export function Graph({nodes, selectedNodes, toggleSelectNode}: Props) {
    return (
        <Box>
            <Xwrapper>
                {nodes.map((node, i)=> {
                    return (
                        <>
                            <ValueNode node={node} key={node.id} selectNode={toggleSelectNode} selected={selectedNodes.includes(node)}/>
                            {node.op && (
                                <>
                                    <OpNode op={node.op} key={`${node.id}-{op}`} id={opNodeId(node, i)}/>
                                    {node.displayContributors.map(p =>  {
                                        return <Xarrow start={p.id} end={opNodeId(node, i)}/>
                                    })}
                                    <Xarrow lineColor="green" headColor="green" start={opNodeId(node, i)} end={node.id}/>
                                </>
                            )}
                        </>
                    )
                })}
            </Xwrapper>
        </Box>
    )
}