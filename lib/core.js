const https = require("https");

let core = {
    requestData: function(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (resp) => {
                let data = "";

                resp.on("data", (chunk) => {
                    data += chunk;
                });

                resp.on("end", (resp) => {
                    let parsedData = JSON.parse(data);
                    resolve(parsedData);
                });
            }).on("error", (error) => {
                console.log("Error: " + error.message);
                reject(error);
            });
        });
    }
}

module.exports = core;
