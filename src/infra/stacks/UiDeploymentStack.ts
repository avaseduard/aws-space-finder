import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { join } from 'path';
import { getSuffixFromStack } from '../Utils';
import { existsSync } from 'fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Create a random suffix
    const suffix = getSuffixFromStack(this);
    // Create the deployment bucket
    const deploymentBucket = new Bucket(this, 'UiDeploymentBucket', {
      bucketName: `space-finder-frontend-${suffix}`,
    });
    // Path to index.html
    const uiDir = join(__dirname, '..', '..', '..', '..', 'space-finder-frontend', 'dist');
    // If path does not exist, print the path and return
    if (!existsSync(uiDir)) {
      console.warn('UI directory not found-->', uiDir);
      return;
    }
    // Deploy the bucket containing the UI Directory
    new BucketDeployment(this, 'SpacesFinderDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
    });
    // Origin identity
    const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    deploymentBucket.grantRead(originIdentity);
    // Distribution
    const distribution = new Distribution(this, 'SpacesFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });
    // Output distribution url
    new CfnOutput(this, 'SpaceFinderUrl', {
      value: distribution.distributionDomainName,
    });
  }
}
