import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { AuthService } from './AuthService';

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login('whatever', '(Parola123)');
  // console.log('JWT TOKEN -->', loginResult.getSignInUserSession().getIdToken().getJwtToken());
  const credentials = await service.generateTemporaryCredentials(loginResult);
  // console.log('CREDENTIALS-->', credentials);
  const buckets = await listBuckets(credentials);
  console.log('BUCKETS-->', buckets);
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();
