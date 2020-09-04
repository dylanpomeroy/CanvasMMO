"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    await addConnectionId(connectionId);
    return {
        statusCode: 200,
        body: "",
    };
};
const addConnectionId = async (connectionId) => {
    return await ddb
        .put({
        TableName: "sessions",
        Item: {
            connectionId,
        },
    })
        .promise();
};
//# sourceMappingURL=onConnect.js.map