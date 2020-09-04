import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
const ddb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId;
  await addConnectionId(connectionId);
  return {
    statusCode: 200,
    body: "",
  };
};

const addConnectionId = async (connectionId: string) => {
  return await ddb
    .put({
      TableName: "sessions",
      Item: {
        connectionId,
      },
    })
    .promise();
};
