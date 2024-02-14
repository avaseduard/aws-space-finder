import { type CognitoUser } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Amplify, Auth } from 'aws-amplify';

const awsRegion = 'eu-central-1';

Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: 'eu-central-1_TvZt12WM5',
    userPoolWebClientId: '3je58pc41qn3dj8cqa0li1222c',
    identityPoolId: 'eu-central-1:da794968-548d-47b9-8346-7c5148cfa039',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    const result = (await Auth.signIn(userName, password)) as CognitoUser;
    return result;
  }
  // Generate temporary cognito user credentials
  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/eu-central-1_TvZt12WM5`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'eu-central-1:da794968-548d-47b9-8346-7c5148cfa039',
        logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
