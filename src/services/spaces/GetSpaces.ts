import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Check for a query input
  if (event.queryStringParameters) {
    // Check for an id in the query
    if ('id' in event.queryStringParameters) {
      // Get the id from query
      const spaceId = event.queryStringParameters['id'];
      // Query the db
      const getItemResponse = await ddbClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: spaceId },
          },
        })
      );
      // If found, return the item
      if (getItemResponse.Item) {
        return {
          statusCode: 200,
          body: JSON.stringify(getItemResponse.Item),
        };
        // If not found, return error
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Space with id ${spaceId} not found!`),
        };
      }
      // If there's no id, return error
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify('Id is required!'),
      };
    }
  }

  // Return the whole table for querys wo id
  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  console.log(result.Items);

  return {
    statusCode: 201,
    body: JSON.stringify(result.Items),
  };
}
