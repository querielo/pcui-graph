import React from 'react';
import Component from './component';
import Graph, {GRAPH_ACTIONS } from './index.js';
import { getDescriptionForClass, getPropertiesForClass } from '../../../.storybook/utils/docscript'
// import core_nodes from '../../../core_nodes.json';

// import { shadergraph } from 'playcanvas';

var name = 'Graph';
var config = {
    title: `Input/${name}`,
    description: getDescriptionForClass(name),
    args: getPropertiesForClass(name),
};

export default {
    title: config.title,
    component: Component,
    parameters: {
        docs: {
            storyDescription: config.description
        }
    },
    argTypes: config.args
};

/*
var ANIM_SCHEMA = {
    NODE: {
        STATE: 0,
        START_STATE: 3,
        ANY_STATE: 4,
        END_STATE: 5
    },
    EDGE: {
        TRANSITION_DEFAULT: 0,
        TRANSITION: 1,
        TRANSITION_FROM_ANY: 3
    },
    PORTS: {
        TEXTURE: 0,
        FLOAT: 1,
        VEC_2: 2,
        VEC_3: 3,
        VEC_4: 4,
        MATRIX: 5
    }
};

var animSchema = {
    nodes: {
        [ANIM_SCHEMA.NODE.STATE]: {
            name: 'state',
            fill: '#364346',
            stroke: '#20292b',
            contextMenuItems: [
                {
                    text: 'Add transition',
                    action: GRAPH_ACTIONS.ADD_EDGE,
                    edgeType: ANIM_SCHEMA.EDGE.TRANSITION
                },
                {
                    text: 'Delete state',
                    action: GRAPH_ACTIONS.DELETE_NODE
                }
            ]
        },
        [ANIM_SCHEMA.NODE.START_STATE]: {
            name: 'startState',
            fill: '#507b50',
            stroke: '#20292b',
            contextMenuItems: [
                {
                    text: 'Add transition',
                    action: GRAPH_ACTIONS.ADD_EDGE,
                    edgeType: ANIM_SCHEMA.EDGE.TRANSITION
                }
            ]
        },
        [ANIM_SCHEMA.NODE.ANY_STATE]: {
            name: 'anyState',
            fill: '#505a7b',
            stroke: '#20292b',
            contextMenuItems: [
                {
                    text: 'Add transition',
                    action: GRAPH_ACTIONS.ADD_EDGE,
                    edgeType: ANIM_SCHEMA.EDGE.TRANSITION_FROM_ANY
                }
            ]
        },
        [ANIM_SCHEMA.NODE.END_STATE]: {
            name: 'endState',
            fill: 'red',
            stroke: '#20292b',
            contextMenuItems: []
        }
    },
    edges: {
        [ANIM_SCHEMA.EDGE.TRANSITION_DEFAULT]: {
            stroke: '#f60',
            targetMarker: true,
            from: [
                ANIM_SCHEMA.NODE.START_STATE
            ],
            to: [
                ANIM_SCHEMA.NODE.STATE
            ],
            contextMenuItems: [],
        },
        [ANIM_SCHEMA.EDGE.TRANSITION]: {
            stroke: '#20292b',
            targetMarker: true,
            from: [
                ANIM_SCHEMA.NODE.STATE,
                ANIM_SCHEMA.NODE.START_STATE
            ],
            to: [
                ANIM_SCHEMA.NODE.STATE,
                ANIM_SCHEMA.NODE.END_STATE
            ],
            contextMenuItems: [],
        },
        [ANIM_SCHEMA.EDGE.TRANSITION_FROM_ANY]: {
            stroke: '#20292b',
            targetMarker: true,
            contextMenuItems: [],
            from: [
                ANIM_SCHEMA.NODE.ANY_STATE
            ],
            to: [
                ANIM_SCHEMA.NODE.STATE,
                ANIM_SCHEMA.NODE.END_STATE
            ]
        }
    }
};

var animData = {
    nodes: {
        0: {
            id: 0,
            nodeType: ANIM_SCHEMA.NODE.START_STATE,
            name: 'START',
            posX: 50,
            posY: 50
        },
        1: {
            id: 1,
            nodeType: ANIM_SCHEMA.NODE.STATE,
            name: 'New State',
            posX: 200,
            posY: 200
        },
        2: {
            id: 2,
            nodeType: ANIM_SCHEMA.NODE.ANY_STATE,
            name: 'ANY',
            posX: 400,
            posY: 50
        }
    },
    edges: {
        '0-1': {
            from: 0,
            to: 1,
            edgeType: ANIM_SCHEMA.EDGE.TRANSITION_DEFAULT
        }
    }
};

var animContextMenuItems = [
    {
        text: 'Add new state',
        action: GRAPH_ACTIONS.ADD_NODE,
        nodeType: ANIM_SCHEMA.NODE.STATE,
        name: 'New state'
    }
];

export const Anim = (args) => { 
    return <Component graphSchema={animSchema} graphData={animData} contextMenuItems={animContextMenuItems} />;
};
*/

var MATERIAL_SCHEMA = {
    NODE: {
        PARAM_FLOAT: 0,
        PARAM_VEC_2: 1,
        PARAM_VEC_3: 2,
        PARAM_VEC_4: 3,
        PARAM_TEXTURE: 4,
        OUTPUT_STDMAT: 5,
    },
    EDGE: {
        FLOAT: 1,
        VEC_2: 2,
        VEC_3: 3,
        VEC_4: 4,
        TEXTURE: 5
    }
};

var materialSchema = {
    nodes: {
        [MATERIAL_SCHEMA.NODE.PARAM_FLOAT]: {
            name: 'Float Param',
            fill: 'grey',
            stroke: '#20292b',
            contextMenuItems: [],
            outPorts: [
                {
                    name: 'output',
                    type: MATERIAL_SCHEMA.EDGE.FLOAT
                }
            ]
        },
        [MATERIAL_SCHEMA.NODE.PARAM_VEC_2]: {
            name: 'Vec2 Param',
            fill: 'grey',
            stroke: '#20292b',
            contextMenuItems: [],
            outPorts: [
                {
                    name: 'output',
                    type: MATERIAL_SCHEMA.EDGE.VEC_2
                }
            ]
        },
        [MATERIAL_SCHEMA.NODE.PARAM_VEC_3]: {
            name: 'Vec3 Param',
            fill: 'grey',
            stroke: '#20292b',
            contextMenuItems: [],
            outPorts: [
                {
                    name: 'output',
                    type: MATERIAL_SCHEMA.EDGE.VEC_3
                }
            ]
        },
        [MATERIAL_SCHEMA.NODE.PARAM_VEC_4]: {
            name: 'Vec4 Param',
            fill: 'grey',
            stroke: '#20292b',
            contextMenuItems: [],
            outPorts: [
                {
                    name: 'output',
                    type: MATERIAL_SCHEMA.EDGE.VEC_4
                }
            ]
        },        
        [MATERIAL_SCHEMA.NODE.PARAM_TEXTURE]: {
            name: 'Texture Param',
            fill: 'grey',
            stroke: '#20292b',
            contextMenuItems: [],
            outPorts: [
                {
                    name: 'output',
                    type: MATERIAL_SCHEMA.EDGE.TEXTURE
                }
            ]
        },    
        [MATERIAL_SCHEMA.NODE.OUTPUT_STDMAT]: {
            name: 'StdMat Output',
            fill: 'grey',
            stroke: '#20292b',
            contextMenuItems: [
                {
                    text: 'Save JSON',
                    action: GRAPH_ACTIONS.SAVE_JSON
                }                
            ],
            inPorts: [
                {
                    name: 'vertex offset',
                    type: MATERIAL_SCHEMA.EDGE.VEC_3
                },
                {
                    name: 'albedo',
                    type: MATERIAL_SCHEMA.EDGE.VEC_3
                },
                {
                    name: 'normal',
                    type: MATERIAL_SCHEMA.EDGE.VEC_3
                },
                {
                    name: 'glossiness',
                    type: MATERIAL_SCHEMA.EDGE.FLOAT
                },                    
                {
                    name: 'specularity',
                    type: MATERIAL_SCHEMA.EDGE.VEC_3
                },                
                {
                    name: 'emissive',
                    type: MATERIAL_SCHEMA.EDGE.VEC_3
                },
                {
                    name: 'alpha',
                    type: MATERIAL_SCHEMA.EDGE.FLOAT
                }
            ]
        }
    },
    edges: {
        [MATERIAL_SCHEMA.EDGE.FLOAT]: {
            stroke: 'rgba(140, 230, 230, 1.0)',
            strokeWidth: 2,
            targetMarker: null,
            smooth: true,
            contextMenuItems: [
                {
                    text: 'Delete edge',
                    action: GRAPH_ACTIONS.DELETE_EDGE
                }
            ],
        },
        [MATERIAL_SCHEMA.EDGE.VEC_2]: {
            stroke: 'rgba(170, 260, 170, 1.0)',
            strokeWidth: 2,
            targetMarker: null,
            smooth: true,
            contextMenuItems: [
                {
                    text: 'Delete edge',
                    action: GRAPH_ACTIONS.DELETE_EDGE
                }
            ],
        },
        [MATERIAL_SCHEMA.EDGE.VEC_3]: {
            stroke: 'rgba(230, 140, 230, 1.0)',
            strokeWidth: 2,
            targetMarker: null,
            smooth: true,
            contextMenuItems: [
                {
                    text: 'Delete edge',
                    action: GRAPH_ACTIONS.DELETE_EDGE
                }
            ],
        },
        [MATERIAL_SCHEMA.EDGE.VEC_4]: {
            stroke: 'rgba(260, 170, 170, 1.0)',
            strokeWidth: 2,
            targetMarker: null,
            smooth: true,
            contextMenuItems: [
                {
                    text: 'Delete edge',
                    action: GRAPH_ACTIONS.DELETE_EDGE
                }
            ],
        },
        [MATERIAL_SCHEMA.EDGE.TEXTURE]: {
            stroke: 'rgba(230, 230, 140, 1.0)',
            strokeWidth: 2,
            targetMarker: null,
            smooth: true,
            contextMenuItems: [
                {
                    text: 'Delete edge',
                    action: GRAPH_ACTIONS.DELETE_EDGE
                }
            ],
        }
    }
};

var materialData = {
    nodes: {
        1234: {
            id: 1234,
            nodeType: MATERIAL_SCHEMA.NODE.OUTPUT_STDMAT,
            name: 'StdMat Output',
            posX: 900,
            posY: 350
            // texture: 'https://cdnb.artstation.com/p/assets/images/images/008/977/853/large/'
        }
    },
    edges: {
 /*       '1234,0-1236,0': {
            edgeType: MATERIAL_SCHEMA.EDGE.FLOAT,
            from: 1234,
            to: 1236,
            outPort: 0,
            inPort: 0
        }*/
    }
};

var materialContextMenuItems = [
    {
        text: 'New Float Param',
        action: GRAPH_ACTIONS.ADD_NODE,
        nodeType: MATERIAL_SCHEMA.NODE.PARAM_FLOAT,
        name: 'Float Param'
    },
    {
        text: 'New Vec2 Param',
        action: GRAPH_ACTIONS.ADD_NODE,
        nodeType: MATERIAL_SCHEMA.NODE.PARAM_VEC_2,
        name: 'Vec2 Param'
    },
    {
        text: 'New Vec3 Param',
        action: GRAPH_ACTIONS.ADD_NODE,
        nodeType: MATERIAL_SCHEMA.NODE.PARAM_VEC_3,
        name: 'Vec3 Param'
    },
    {
        text: 'New Vec4 Param',
        action: GRAPH_ACTIONS.ADD_NODE,
        nodeType: MATERIAL_SCHEMA.NODE.PARAM_VEC_4,
        name: 'Vec4 Param'
    },
    {
        text: 'New Texture Param',
        action: GRAPH_ACTIONS.ADD_NODE,
        nodeType: MATERIAL_SCHEMA.NODE.PARAM_TEXTURE,
        name: 'Texture Param'
    },
];


export const Material = (args) => { 

    return <Component graphSchema={materialSchema} graphData={materialData} contextMenuItems={materialContextMenuItems} />;

    // return <Component graphSchema={coreNodeSchema} contextMenuItems={coreContextItem}/>;
};

document.querySelector('#root').setAttribute('style', 'position: fixed; width: 100%; height: 100%');

setTimeout(() => {
    document.body.setAttribute('style', 'margin: 0px; padding: 0px;');
}, 1);