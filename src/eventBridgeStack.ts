//
import cdk = require('@aws-cdk/core')
import iam = require('@aws-cdk/aws-iam')
import s3 = require('@aws-cdk/aws-s3')
import lambda = require ('@aws-cdk/aws-lambda')
import kinesisfirehose = require('@aws-cdk/aws-kinesisfirehose')

export interface EventBridgeStackProps extends cdk.StackProps
{
  command2events: lambda.Function
}
export class EventBridgeStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: EventBridgeStackProps) {
    super(scope, id)

    // Create S3 bucket for the event store
    const bucket = new s3.Bucket(this, 'EventBridgeS3DestinationBucket')

    // Create a IAM role for Firehose to use to put events
    const s3Role = new iam.Role(this, 'eventBridgeS3Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com')
    })
    // Create the Firehose with connection to S3, assign role and config
    const deliveryStream = new kinesisfirehose.CfnDeliveryStream(this, 'firehose', {
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
  /*
   if (props) {
      const lambda = props.command2events
      const ebd = new EventBridgeDestination()
      ebd.bind(deliveryStream, lambda)
    } */
  }
}
