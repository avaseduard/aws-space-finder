import { handler } from '../src/services/spaces/handler';

handler(
  // // PUT Method
  // {
  //   httpMethod: 'PUT',
  //   queryStringParameters: {
  //     id: '1508f3ad-122e-4851-8d0a-f6700f95af34',
  //   },
  //   body: JSON.stringify({
  //     location: 'London updated',
  //   }),
  // } as any,
  // {} as any
  // // POST method
  // {
  //   httpMethod: 'POST',
  //   queryStringParameters: {
  //     id: '1508f3ad-122e-4851-8d0a-f6700f95af34',
  //   },
  //   body: JSON.stringify({
  //     location: 'London2',
  //   }),
  // } as any,
  // {} as any
  // // GET method
  //    {
  //   httpMethod: 'GET',
  // } as any,
  // {} as any
  // DELETE method
  {
    httpMethod: 'DELETE',
    queryStringParameters: {
      id: '1508f3ad-122e-4851-8d0a-f6700f95af34',
    },
  } as any,
  {} as any
);
