import { OpNode, ValueNode } from "./node";
import { Value } from "../util/engine"
import Xarrow, { Xwrapper } from "react-xarrows";
import { Box } from "@mui/material";


type Props = {
    nodes:Value[],
    selectedNodes: Value[],
    toggleSelectNode: (v: Value) => void;
}

export function Graph({nodes, selectedNodes, toggleSelectNode}: Props) {
    return (
        <Box>
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
        </Box>
    )
}