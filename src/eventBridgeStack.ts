/* eslint-disable no-unused-vars */
//
import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose'
import { EventBus, Rule, RuleTargetInput } from '@aws-cdk/aws-events'
import { Stack, StackProps, Construct } from '@aws-cdk/core'
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Bucket } from '@aws-cdk/aws-s3'
import { EventBridgeDestination } from '@aws-cdk/aws-lambda-destinations'
import { Function as LambdaFunction } from '@aws-cdk/aws-lambda'

export interface EventBridgeStackProps extends StackProps
{
  command2events: LambdaFunction
}
export class EventBridgeStack extends Construct {
  public readonly eventBus: EventBus
  constructor (scope: Construct, id: string, props: EventBridgeStackProps) {
    super(scope, id)
    // Create S3 bucket for the event store
    const bucket = new Bucket(this, 'EventBridgeS3DestinationBucket')
    // Create a IAM role for Firehose to use to put events
    const s3Role = new Role(this, 'eventBridgeS3Role', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com')
    })
    // Create the Firehose with connection to S3, assign role and config
    const deliveryStream = new CfnDeliveryStream(this, 'firehose', {
      deliveryStreamName: 'CQE-delivery-stream',
      deliveryStreamType: 'DirectPut',
      s3DestinationConfiguration: {
        bucketArn: bucket.bucketArn,
        roleArn: s3Role.roleArn,
        bufferingHints: {
          sizeInMBs: 128,
          intervalInSeconds: 900
        },
        cloudWatchLoggingOptions: {
          enabled: true,
          logGroupName: '/aws/kinesisfirehose/test-delivery-stream',
          logStreamName: 'S3Delivery'
        },
        compressionFormat: 'UNCOMPRESSED',
        errorOutputPrefix: '',
        prefix: ''
      }
    })
    this.eventBus = new EventBus(this, 'CQEEventBus')

    if (props) {
      const eventBridgeDestination = new EventBridgeDestination(this.eventBus)
      eventBridgeDestination.bind(deliveryStream, props.command2events)
    }
  }
}
