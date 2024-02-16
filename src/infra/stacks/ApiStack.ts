import { Stack, StackProps } from 'aws-cdk-lib';
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  ResourceOptions,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    //
    const api = new RestApi(this, 'SpacesApi');
    // Create authorizer for cognito user pool and attach to spaces api
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
      cognitoUserPools: [props.userPool],
      identitySource: 'method.request.header.Authorization',
    });
    authorizer._attachToApi(api);
    // Set authorizer options so it can be attached ot each method
    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: { authorizerId: authorizer.authorizerId },
    };
    // Cors options
    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };
    // Path and cors options
    const spacesResource = api.root.addResource('spaces', optionsWithCors);
    // Api methods
    spacesResource.addMethod('GET', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResource.addMethod('POST', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResource.addMethod('PUT', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResource.addMethod('DELETE', props.spacesLambdaIntegration, optionsWithAuth);
  }
}
