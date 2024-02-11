import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hasAdminGroup } from '../shared/Utils';

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Check if user is authorized to delete (is admin)
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify('Not authorized!'),
    };
  }

  // Check for a query input
  if (event.queryStringParameters && 'id' in event.queryStringParameters) {
    // Get the id
    const spaceId = event.queryStringParameters['id'];
    // Delete item
    const deleteResult = await ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(`Space with id ${spaceId} has been deleted.`),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify('Invalid request!'),
  };
}
