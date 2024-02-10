import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';

const awsRegion = 'eu-central-1';

Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: 'eu-central-1_TvZt12WM5',
    userPoolWebClientId: '3je58pc41qn3dj8cqa0li1222c',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    const result = (await Auth.signIn(userName, password)) as CognitoUser;
    return result;
  }
}
