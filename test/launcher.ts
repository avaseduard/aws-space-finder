import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = 'eu-central-1';
process.env.TABLE_NAME = 'SpaceTable-06b417c9ef95';

handler(
  {
    httpMethod: 'GET',
    queryStringParameters: {
      id: '1508f3ad-122e-4851-8d0a-f6700f95af34',
    },
    // body: JSON.stringify({
    //   location: 'London',
    // }),
  } as any,
  {} as any
);
