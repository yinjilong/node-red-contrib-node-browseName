module.exports = function (RED) {
    function AttachNodeBrowseName(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.browse_names = {};
        node.id_token = /ns=\d?;[is]=/
        node.on('input', function (msg) {
            if (msg.hasOwnProperty('browseName')) {
                var topic = msg.topic;
                if (node.id_token.test(msg.topic)) {
                    // add to dict
                    var browseName = msg.browseName;
                    node.browse_names[topic] = browseName;
                    if (config.enableStatus)
                        this.status({ fill: "green", shape: "dot", text: "browseName stored:" + browseName });
                }
            }
            else {
                if (typeof msg.topic === 'object') {
                    if (msg.topic.hasOwnProperty('nodeId')) {
                        var nodeID = msg.topic.nodeId;
                        //attach browse_name
                        if (node.browse_names.hasOwnProperty(nodeID) && !msg.topic.hasOwnProperty('browseName')) {
                            msg.topic.browseName = node.browse_names[nodeID];
                            if (config.enableStatus)
                                this.status({ fill: "green", shape: "dot", text: "browseName attached:" + msg.topic.browseName });
                        }
                    }
                } else if (node.id_token.test(msg.topic)) {  //topic is ua node number
                    var nodeID = msg.topic.nodeId;
                    if (node.browse_names.hasOwnProperty(nodeID) && !msg.hasOwnProperty('browseName')) {
                        msg.browseName = node.browse_names[nodeID];
                        if (config.enableStatus)
                            this.status({ fill: "green", shape: "dot", text: "browseName attached:" + msg.browseName });
                    }

                }
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("attach-node-browseName", AttachNodeBrowseName);
}