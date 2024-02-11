import { AuthService } from './AuthService';

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login('whatever', '(Parola123)');
  console.log('JWT TOKEN -->', loginResult.getSignInUserSession().getIdToken().getJwtToken());
}

testAuth();
