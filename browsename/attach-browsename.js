module.exports = function(RED) {
    function AttachNodeBrowseName(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.browse_names ={};
        node.on('input', function(msg) {
            if (msg.hasOwnProperty('browseName')) {
                // add to dict
                var topic = msg.topic;
                var browseName = msg.browseName;
                node.browse_names[topic]=browseName;
            } 
            else{
                if (typeof msg.topic === 'object'){
                    if(msg.topic.hasOwnProperty('nodeId')){
                        var nodeID = msg.topic.nodeId;
                        //get browse_name
                        if (node.browse_names.hasOwnProperty(nodeID) && !msg.topic.hasOwnProperty('browseName')){
                            msg.topic.browseName = node.browse_names[nodeID];                        
                        }                    
                    }                
                }
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("attach-node-browseName",AttachNodeBrowseName);
}