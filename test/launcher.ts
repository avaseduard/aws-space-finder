import { handler } from '../src/services/spaces/handler';

handler(
  {
    httpMethod: 'PUT',
    queryStringParameters: {
      id: '1508f3ad-122e-4851-8d0a-f6700f95af34',
    },
    body: JSON.stringify({
      location: 'London updated',
    }),
  } as any,
  {} as any
);
