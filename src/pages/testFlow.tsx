import React, {useCallback, useState} from 'react';
import {Canvas, Node, Edge, Port,useUndo} from 'reaflow';
import './flow.less';

const nodes = [
    {
        id: '1',
        text: '1'
    },
    {
        id: '2',
        text: '2'
    },
    {
        id: '3',
        text: '3'
    },
    {
        id: '4',
        text: '4'
    },
    {
        id: '5',
        text: '5'
    }, {
        id: '6',
        text: '6'
    },
    {
        id: '7',
        text: '7',
        data: '1223'
    }
];

const edges = [
    {
        id: '1-2',
        from: '1',
        to: '2'
    },
    {
        id: '2-3',
        from: '2',
        to: '3'
    },
    {
        id: '2-4',
        from: '2',
        to: '4'
    },
    {
        id: '3-5',
        from: '3',
        to: '5'
    },
    {
        id: '2-6',
        from: '2',
        to: '6'
    }, {
        id: '2-7',
        from: '2',
        to: '7'
    },
    {
        id: '6-5',
        from: '6',
        to: '5'
    }, {
        id: '7-5',
        from: '7',
        to: '5'
    },
    {
        id: '4-5',
        from: '4',
        to: '5'
    }
];

let getNode = () => {
    const newNodes = nodes.map(node => {
        const {id} = node;
        node.ports = [{
            id: `${id}-from`,
            side: 'EAST',
            height: 0,
            width: 0
            // 'EAST' | 'WEST'
        }, {
            id: `${id}-to`,
            side: 'WEST',
            height: 0,
            width: 0
        }]
        node.text = ' '
        // node.width = 200;
        // node.height = 200;
        return node;
    })
    return newNodes;
};

let getEdge = () => {
    const newEdges = edges.map((edge) => {
        const {from, to} = edge;
        edge.fromPort = `${from}-from`;
        edge.toPort = `${to}-to`;
        return edge;
    })
    return newEdges;
};

function Flow() {
    return (
        <div style={{height: '100vh', width: '100vw'}}>
            <Canvas nodes={getNode()}
                    edges={getEdge()}
                    direction={"RIGHT"}
                    edge={<Edge interpolation={'linear'}/>}
                    node={<Node className={'test-node-class'} remove={<div>删除</div>}>{event => {
                        console.log(123, event);
                        return <foreignObject height={event.height} width={event.width} x={0} y={0}>
                            <div style={{color: 'white', height: '100%', background: 'green', borderRadius: 6}}>
                                123
                            </div>
                        </foreignObject>
                    }}</Node>}
            />
        </div>
    );
}

export default Flow;
