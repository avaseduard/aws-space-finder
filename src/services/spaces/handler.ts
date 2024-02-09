import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpace } from './UpdateSpace';
import { deleteSpace } from './DeleteSpace';
import { JsonError, MissingFieldError } from '../shared/Validator';

// Initialize DynamoDb
const ddbClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        console.log(getResponse);
        return getResponse;
      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        console.log(postResponse);
        return postResponse;
      case 'PUT':
        const putResponse = await updateSpace(event, ddbClient);
        console.log(putResponse);
        return putResponse;
      case 'DELETE':
        const deleteResponse = await deleteSpace(event, ddbClient);
        console.log(deleteResponse);
        return deleteResponse;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
    // If there's a missing field, return personalized error
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    // If the JSON is invalid, return personalized error
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    // If it's another error, return internal server error
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };
  return response;
}

export { handler };
