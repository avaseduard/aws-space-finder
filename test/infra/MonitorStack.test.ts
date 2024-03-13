import { App } from 'aws-cdk-lib';
import { MonitorStack } from '../../src/infra/stacks/MonitorStack';
import { Match, Template } from 'aws-cdk-lib/assertions';

describe('Initial test suite', () => {
  let monitorStackTemplate: Template;

  beforeAll(() => {
    const testApp = new App({ outdir: 'cdk.out' });
    const monitorStack = new MonitorStack(testApp, 'MonitorStack');
    monitorStackTemplate = Template.fromStack(monitorStack);
  });

  test('Lambda properties', () => {
    monitorStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs20.x',
    });
  });

  test('Sns Topic Properties', () => {
    monitorStackTemplate.hasResourceProperties('AWS::SNS::Topic', {
      DisplayName: 'AlarmTopic',
      TopicName: 'AlarmTopic',
    });
  });

  test('Sns Subscription Properties with matches', () => {
    monitorStackTemplate.hasResourceProperties(
      'AWS::SNS::Subscription',
      Match.objectEquals({
        Protocol: 'lambda',
        TopicArn: { Ref: Match.stringLikeRegexp('AlarmTopic') },
        Endpoint: {
          'Fn::GetAtt': [Match.stringLikeRegexp('webHookLambda'), 'Arn'],
        },
      })
    );
  });

  test('Sns Subscription Properties with exact values', () => {
    const snsTopic = monitorStackTemplate.findResources('AWS::SNS::Topic');
    const snsTopicName = Object.keys(snsTopic)[0];

    const lambda = monitorStackTemplate.findResources('AWS::Lambda::Function');
    const lambdaName = Object.keys(lambda)[0];

    monitorStackTemplate.hasResourceProperties(
      'AWS::SNS::Subscription',
      {
        Protocol: 'lambda',
        TopicArn: { Ref: snsTopicName },
        Endpoint: {
          'Fn::GetAtt': [lambdaName, 'Arn'],
        },
      }
    );
  });
});
