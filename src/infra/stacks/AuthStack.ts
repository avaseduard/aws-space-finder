import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';

export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    this.createAdminsGroup();
  }

  // Initialize cognito user pool
  private createUserPool() {
    this.userPool = new UserPool(this, 'SpaceUserPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });
    // Print user pool id
    new CfnOutput(this, 'SpaceUserPoolId', {
      value: this.userPool.userPoolId,
    });
  }

  // Initialize cognito user pool client
  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient('SpaceUserPoolClient', {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });
    // Print user pool id
    new CfnOutput(this, 'SpaceUserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  // Admin group
  private createAdminsGroup() {
    new CfnUserPoolGroup(this, 'SpaceAdmins', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admins',
    });
  }
}
