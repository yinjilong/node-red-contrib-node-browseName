module.exports = function (RED) {
    function AttachNodeBrowseName(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.browse_names = {};
        node.id_token = /ns=\d?;[is]=/
        node.on('input', function (msg) {
            if (typeof msg.topic === 'string' && node.id_token.test(msg.topic)) {
                var nodeId = msg.topic;
                if (msg.hasOwnProperty('browseName')) {
                    // add to dict
                    var browseName = msg.browseName;
                    node.browse_names[nodeId] = browseName;
                    if (config.enableStatus)
                        this.status({ fill: "green", shape: "dot", text: "browseName stored:" + browseName });

                } else if (node.browse_names.hasOwnProperty(nodeId)) {
                    msg.browseName = node.browse_names[nodeId];
                }
            } else if (typeof msg.topic === 'object') {
                if (msg.topic.hasOwnProperty('nodeId') && !msg.topic.hasOwnProperty('browseName')) {
                    var nodeId = msg.topic.nodeId;
                    if (node.browse_names.hasOwnProperty(nodeId)) {
                        //attach browse_name                    
                        msg.topic.browseName = node.browse_names[nodeId];
                        if (config.enableStatus)
                            this.status({ fill: "green", shape: "dot", text: "browseName attached:" + msg.topic.browseName });
                    }
                }
            }
            if (msg.hasOwnProperty(`serverTimestamp`))
            node.send(msg);
        })
    }
    RED.nodes.registerType("attach-node-browseName", AttachNodeBrowseName);
}