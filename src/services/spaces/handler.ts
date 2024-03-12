import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpace } from './UpdateSpace';
import { deleteSpace } from './DeleteSpace';
import { JsonError, MissingFieldError } from '../shared/Validator';
import { addCorsHeader } from '../shared/Utils';
import { captureAWSv3Client } from 'aws-xray-sdk-core';

// Initialize DynamoDb
const ddbClient = new DynamoDBClient({});
// const ddbClient = captureAWSv3Client(new DynamoDBClient({}));

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string;
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        response = getResponse;
        break;
      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        response = postResponse;
        break;
      case 'PUT':
        const putResponse = await updateSpace(event, ddbClient);
        response = putResponse;
        break;
      case 'DELETE':
        const deleteResponse = await deleteSpace(event, ddbClient);
        response = deleteResponse;
        break;
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
  // Add cors header to response to avoid error
  addCorsHeader(response);
  return response;
}

export { handler };
