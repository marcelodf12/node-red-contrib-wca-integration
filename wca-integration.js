const fetch = require('node-fetch');

module.exports = function (RED) {
    
    function wcaConfig(config) {
        RED.nodes.createNode(this, config);
        this.token = config.token;
        this.from = config.from;
    } 

    function wcaIntegrationNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        console.log("Init integration");
        console.log(config);

        const auth = RED.nodes.getNode(config.auth);
        const token = auth.token
        const from = auth.from
        const to = config.destination

        node.on('input', function (msg) {
            const textMsg = msg.payload
            console.log(msg);
            

            var myHeaders = new fetch.Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");

            console.log(myHeaders.get('Authorization'));

            var raw = JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `${to}`,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": `${textMsg}`
                }
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const url = `https://graph.facebook.com/v15.0/${from}/messages`

            console.log(url);
            console.log(requestOptions);

            fetch(url , requestOptions)
                .then(response => response.text())
                .then(result => {console.log(result); node.send(result)})
                .catch(error => {console.log(error); node.send(error)});
        });

        node.on('close', function () {
            console.log("Close integration");
        });

    }

    RED.nodes.registerType("wca-integration", wcaIntegrationNode);
    RED.nodes.registerType("wca-config", wcaConfig);
}