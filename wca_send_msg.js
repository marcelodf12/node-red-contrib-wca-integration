const fetch = require('node-fetch');

module.exports = function (RED) {
    
    function wcaConfig(config) {
        RED.nodes.createNode(this, config);
        this.token = config.token;
        this.from = config.from;
    } 
    function wcaSendMsgNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        console.log("Init integration");

        const auth = RED.nodes.getNode(config.auth);
        const token = auth.token
        const from = auth.from
        const to = config.destination

        node.on('input', function (msg) {
            const textMsg = msg.payload.msg

            const dest = msg.payload.destination || to
           
            var myHeaders = new fetch.Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `${dest}`,
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

            fetch(url , requestOptions)
                .then(response => response.text())
                .then(result => {console.log(result); node.send(result)})
                .catch(error => {console.log(error); node.send(error)});
        });

        node.on('close', function () {
            console.log("Close integration");
        });

    }

    function wcaSendImageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        console.log("Init integration");

        const auth = RED.nodes.getNode(config.auth);
        const token = auth.token
        const from = auth.from
        const to = config.destination

        node.on('input', function (msg) {
            const link = msg.payload.link

            const dest = msg.payload.destination || to
           
            var myHeaders = new fetch.Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `${dest}`,
                "type": "image",
                "image": {
                    "link": `${link}`
                }
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const url = `https://graph.facebook.com/v15.0/${from}/messages`

            fetch(url , requestOptions)
                .then(response => response.text())
                .then(result => {console.log(result); node.send(result)})
                .catch(error => {console.log(error); node.send(error)});
        });

        node.on('close', function () {
            console.log("Close integration");
        });

    }

    function wcaSendTemplateNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        console.log("Init integration");

        const auth = RED.nodes.getNode(config.auth);
        const token = auth.token
        const from = auth.from
        const to = config.destination
        const template = config.template
        const lang = config.lang

        node.on('input', function (msg) {
            const components = msg.payload.components

            const dest = msg.payload.destination || to
           
            var myHeaders = new fetch.Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `${dest}`,
                "type": "template",
                "template": {
                    "name": `${template}`,
                    "language": {
                        "code": `${lang}`
                    }
                }
            });

            if(Array.isArray(components)){
                raw.components = components
            }

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const url = `https://graph.facebook.com/v15.0/${from}/messages`

            fetch(url , requestOptions)
                .then(response => response.text())
                .then(result => {console.log(result); node.send(result)})
                .catch(error => {console.log(error); node.send(error)});
        });

        node.on('close', function () {
            console.log("Close integration");
        });

    }

    RED.nodes.registerType("wca_send_msg", wcaSendMsgNode);
    RED.nodes.registerType("wca_send_template", wcaSendTemplateNode);
    RED.nodes.registerType("wca_send_image", wcaSendImageNode);
    RED.nodes.registerType("wca_config", wcaConfig);
}