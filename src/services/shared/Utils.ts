import { APIGatewayProxyEvent } from 'aws-lambda';
import { JsonError } from './Validator';
import { randomUUID } from 'crypto';

// Create random id using crypto
export function createRandomId() {
  return randomUUID();
}

// Parse JSON and throw error if it's invalid format
export function parseJson(arg: any) {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new JsonError(error.message);
  }
}

// Get cognito group; return true if admin or false if not
export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];
  if (groups) {
    return (groups as string).includes('admins');
  }
  return false;
}
