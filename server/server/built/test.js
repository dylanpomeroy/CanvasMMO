"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
exports.handler = async (event) => {
    console.log(JSON.stringify(event, null, 2));
    const { send } = getSocketContext(event);
    await send(JSON.stringify({
        message: "This response was pushed from my Lambda.",
    }));
    return {
        isBase64Encoded: false,
        statusCode: 200,
        body: "",
    };
};
function getSocketContext(event) {
    const { domainName, stage, connectionId } = event.requestContext;
    const endpoint = `${domainName}/${stage}`;
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint,
    });
    const send = async (data) => {
        await apigwManagementApi
            .postToConnection({
            ConnectionId: connectionId,
            Data: data,
        })
            .promise();
    };
    return {
        connectionId,
        endpoint,
        send,
    };
}
//# sourceMappingURL=test.js.map