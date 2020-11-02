import { Element } from '@playcanvas/pcui/pcui';
import { Observer } from '@playcanvas/pcui/pcui-binding';
import { diff } from 'json-diff';
import GraphView from './graph-view';
import './style.scss';

import core_nodes from '../../../core_nodes.json';
import { shadergraph } from 'playcanvas';

const deepCopyFunction = (inObject) => {
    let outObject, value, key;

    if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
        value = inObject[key];

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopyFunction(value);
    }

    return outObject;
};


export var GRAPH_ACTIONS = {
    ADD_NODE: 0,
    DELETE_NODE: 1,
    ADD_EDGE: 2,
    DELETE_EDGE: 3
};

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

/**
 * @name Graph
 * @classdesc Represents a graph.
 * @mixes pcui.IFocusable
 */
class Graph extends Element {
    /**
     * Creates a new Graph.
     *
     * @param {object} args - The arguments. Extends the pcui.Element constructor arguments. All settable properties can also be set through the constructor.
     * @param {boolean} [args.unsafe] - If true then the innerHTML property will be used to set the text. Otherwise textContent will be used instead.
     * @param {number} [args.nodeCount=100] - Amount of nodes to render (each node contains 8-24 links depending on it's position)
     */
    constructor(args) {
        if (!args) args = {};
        super(args.dom ? args.dom : document.createElement('div'), args);
        this.class.add('pcui-graph');
        this.diff = diff;

        this.nodeIdMap = {};

        shadergraph.start(core_nodes);

        this._shaderGraph = shadergraph;

        var coreNodeSchema = args.graphSchema;
        var coreNodeContextMenuItems = args.contextMenuItems;

        Object.keys(core_nodes).forEach( (key, index) => {
            var corenode = shadergraph._getNode(key);

            var inPorts = [];
            var outPorts = [];

            corenode.graphData.ioPorts.forEach( (port) => {
                var portSchema = {};

                switch (port.type) {
                    case 'sampler2D':
                        portSchema.type = MATERIAL_SCHEMA.EDGE.TEXTURE;
                        break;
                    case 'vec2':
                        portSchema.type = MATERIAL_SCHEMA.EDGE.VEC_2;
                        break;
                    case 'vec3':
                        portSchema.type = MATERIAL_SCHEMA.EDGE.VEC_3;
                        break;
                    case 'vec4':
                        portSchema.type = MATERIAL_SCHEMA.EDGE.VEC_4;
                        break;
                    case 'float':
                    default:
                        portSchema.type = MATERIAL_SCHEMA.EDGE.FLOAT;
                        break;
                }

                if (port.name.startsWith('IN_'))
                {
                    portSchema.name = port.name;
                    inPorts.push(portSchema);
                }
                else 
                {
                    portSchema.name = port.name;
                    outPorts.push(portSchema);
                }
            });

            coreNodeSchema.nodes[key] = {
                name: key,
                fill: 'grey',
                stroke: '#20292b',
                contextMenuItems: [],
                inPorts: inPorts,
                outPorts: outPorts
            };

            var coreContextItem = {
                text: 'New ' + key,
                action: GRAPH_ACTIONS.ADD_NODE,
                nodeType: key,
                name: key
            };

            coreNodeContextMenuItems.push(coreContextItem);
        });

        var visGraphData = args.graphData; // { nodes: {}, edges: {} };

        this._graphData = new Observer({ data: visGraphData });
        this._graphSchema = coreNodeSchema;
        this._contextMenuItems = coreNodeContextMenuItems;

        // this._graphData = new Observer({ data: args.graphData });
        // this._graphSchema = args.graphSchema;
        // this._contextMenuItems = args.contextMenuItems;

        this._suppressGraphDataEvents = false;

        this.view = new GraphView(this.dom, this._graphSchema);

        this._buildGraphFromData();
        this._addContextMenu();
    }

    _buildGraphFromData() {
        Object.keys(this._graphData.get(`data.nodes`)).forEach(nodeKey => {
            this.createNode(this._graphData.get(`data.nodes.${nodeKey}`));
        });
        Object.keys(this._graphData.get(`data.edges`)).forEach(edgeKey => {
            this._createConnectedEdge(this._graphData.get(`data.edges.${edgeKey}`), edgeKey);
        });
    }

    _addContextMenu() {
        const viewContextMenuItems = this._contextMenuItems.map(item => {
            switch (item.action) {
                case GRAPH_ACTIONS.ADD_NODE: {
                    item.onClick = (e) => {
                        var node = {
                            ...item,
                            id: Number(`${Date.now()}${Math.floor(Math.random() * 10000)}`)
                        };
                        delete node.action;
                        delete node.text;
                        this.createNode(node, e);
                        this._graphData.set(`data.nodes.${node.id}`, node);
                        this.dom.dispatchEvent(new CustomEvent('createNode', { detail: node }));
                    };
                }
            }
            return item;
        });

        this.view.addContextMenu(viewContextMenuItems);
    }

    _isValidEdge(edgeType, source, target) {
        var edge = this._graphSchema.edges[edgeType];
        return edge.from.includes(this._graphData.get(`data.nodes.${source}.nodeType`)) && edge.to.includes(this._graphData.get(`data.nodes.${target}.nodeType`));
    }

    _createConnectedEdge(edge, edgeId) {
        var edgeSchema = this._graphSchema.edges[edge.edgeType];
        this.view.addEdge(edge, edgeSchema, edgeId);
        var contextMenuItems = deepCopyFunction(edgeSchema.contextMenuItems).map(item => {
            if (item.action === GRAPH_ACTIONS.DELETE_EDGE) {
                item.onClick = () => this._deleteEdge(edgeId);
            }
            return item;
        });
        this.view.addEdgeContextMenu(edgeId, contextMenuItems);

        var srcNodeOrPort = this.nodeIdMap[edge.from];
        var dstNodeOrPort = this.nodeIdMap[edge.to];

        var srcIsPort = (this._graphData.get(`data.nodes`)[edge.from].nodeType < MATERIAL_SCHEMA.NODE.OUTPUT_STDMAT);
        var dstIsPort = (this._graphData.get(`data.nodes`)[edge.to].nodeType === MATERIAL_SCHEMA.NODE.OUTPUT_STDMAT);

        var srcNodeID = srcIsPort ? -1 : srcNodeOrPort;
        var dstNodeID = dstIsPort ? -1 : dstNodeOrPort;
        var srcPortName = srcIsPort ? srcNodeOrPort.name : this._graphSchema.nodes[this._graphData.get(`data.nodes`)[edge.from].nodeType].outPorts[edge.outPort].name;
        var dstPortName = dstIsPort ? dstNodeOrPort.name : this._graphSchema.nodes[this._graphData.get(`data.nodes`)[edge.to].nodeType].inPorts[edge.inPort].name;

        if (dstIsPort)
        {
            switch (edge.inPort) {
                case 0: // 'vertex offset',
                    dstPortName = `OUT_vertOff`;
                    this._shaderGraph.graph.addOutput('vec3', 'vertOff');
                    break;
                case 1: // 'albedo',
                    dstPortName = `OUT_dAlbedo`;
                    this._shaderGraph.graph.addOutput('vec3', 'dAlbedo');
                    break;
                case 2: // 'normal',
                    dstPortName = `OUT_dNormalMap`;
                    this._shaderGraph.graph.addOutput('vec3', 'dNormalMap');
                    break;
                case 3: // 'glossiness',
                    dstPortName = `OUT_dGlossiness`;
                    this._shaderGraph.graph.addOutput('float', 'dGlossiness');
                    break;
                case 4: // 'specularity',
                    dstPortName = `OUT_dSpecularity`;
                    this._shaderGraph.graph.addOutput('vec3', 'dSpecularity');
                    break;
                case 5: // 'emissive',
                    dstPortName = `OUT_dEmission`;
                    this._shaderGraph.graph.addOutput('vec3', 'dEmission');
                    break;
                case 6: // 'alpha',
                    dstPortName = `OUT_dAlpha`;
                    this._shaderGraph.graph.addOutput('float', 'dAlpha');
                    break;                                    
                default:
                    break;
            }
        }

        this.nodeIdMap[edge.id] = this._shaderGraph.graph.connect(srcNodeID, srcPortName, dstNodeID, dstPortName);
    }

    _createUnconnectedEdgeForNode(node, edgeType) {
        const onEdgeConnected = (targetNodeId) => {
            this._graphData.set(`data.edges.${node.id}-${targetNodeId}`, {
                from: node.id,
                to: targetNodeId,
                edgeType: edgeType,
                conditions: {}
            });
        };
        var edgeSchema = this._graphSchema.edges[edgeType];
        this.view.addUnconnectedEdge(node.id, edgeType, edgeSchema, this._isValidEdge.bind(this), onEdgeConnected);
    }

    createNode(node, event) {
        if (!this._graphData.get(`data.nodes.${node.id}`)) {
            this._graphData.set(`data.nodes.${node.id}`, node);
        }
        var nodeSchema = this._graphSchema.nodes[node.nodeType];
        this.view.addNode(node, nodeSchema, event, (edgeId, edge) => {
            this._createConnectedEdge(edge, edgeId);
            this._graphData.set(`data.edges.${edgeId}`, edge);
        });
        this.view.addNodeEvent(node.id, 'updatePosition', (pos) => {
            this._graphData.set(`data.nodes.${node.id}.posX`, pos.x);
            this._graphData.set(`data.nodes.${node.id}.posY`, pos.y);
        });
        this._graphData.on(`data.nodes.${node.id}.name:set`, (value) => {
            this.view.updateNodeName(node.id, value);
        });

        var contextMenuItems = deepCopyFunction(nodeSchema.contextMenuItems).map(item => {
            if (item.action === GRAPH_ACTIONS.ADD_EDGE) {
                item.onClick = () => this._createUnconnectedEdgeForNode(node, item.edgeType);
            }
            if (item.action === GRAPH_ACTIONS.DELETE_NODE) {
                item.onClick = () => this._deleteNode(node);
            }
            if (item.action === GRAPH_ACTIONS.SAVE_JSON) {
                item.onClick = () => this._saveJSON();
            }
            return item;
        });
        this.view.addNodeContextMenu(node.id, contextMenuItems);

        switch (node.nodeType) {
            case MATERIAL_SCHEMA.NODE.PARAM_FLOAT:
                this.nodeIdMap[node.id] = this._shaderGraph.graph.addInput('float', 'float_'+node.id );
                break;
            case MATERIAL_SCHEMA.NODE.PARAM_VEC_2:
                this.nodeIdMap[node.id] = this._shaderGraph.graph.addInput('vec2', 'vec2_'+node.id );
                break;
            case MATERIAL_SCHEMA.NODE.PARAM_VEC_3:
                this.nodeIdMap[node.id] = this._shaderGraph.graph.addInput('vec3', 'vec3_'+node.id );
                break;
            case MATERIAL_SCHEMA.NODE.PARAM_VEC_4:
                this.nodeIdMap[node.id] = this._shaderGraph.graph.addInput('vec4', 'vec4_'+node.id );
                break;
            case MATERIAL_SCHEMA.NODE.PARAM_TEXTURE:
                this.nodeIdMap[node.id] = this._shaderGraph.graph.addInput('sampler2D', 'tex_'+node.id );
                break;
            default:
                this.nodeIdMap[node.id] = this._shaderGraph.graph.addSubGraph(this._shaderGraph._getNode(node.nodeType));
                break;
        }
    }

    _deleteNode(node) {
        this.view.removeNode(node.id);
        this._graphData.unset(`data.nodes.${node.id}`);
        var edgeKeys = Object.keys(this._graphData.get('data.edges'));
        for (var i = 0; i < edgeKeys.length; i++) {
            var edge = this._graphData.get(`data.edges.${edgeKeys[i]}`);
            if (edge.from === node.id || edge.to === node.id){
                this._graphData.unset(`data.edges.${edgeKeys[i]}`);
            }
        }

        // todo
    }

    _deleteEdge(edgeId) {
        this.view.removeEdge(edgeId);
        this._graphData.unset(`data.edges.${edgeId}`);

        // locate edge in shadergraph and invalidate or remove it 
    }

    _saveJSON() {

        function replacer(key, value) {
            // Filtering out properties
            if (typeof value === 'object' && value.graphData)
            {
                return { subgName: value.name };
            }
            return value;
        }

        console.log(JSON.stringify(shadergraph.graph.graphData, replacer.bind(this)));
    }
}

export default Graph;
