import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import { EventBridgeStack } from '../src/eventBridgeStack'
import cdk = require('@aws-cdk/core')

describe('event Bridge Test suite', () => {
  // GIVEN
  const app = new cdk.App()
  const stack = new EventBridgeStack(app, 'TestEventBridgeStack')

  it('It should contain a bucket', () => {
    expectCDK(stack).to(haveResource('AWS::S3::Bucket'))
  })
  it('It should contain a role', () => {
    expectCDK(stack).to(haveResource('AWS::IAM::Role', {}))
  })
  it('It should contain a delivery stream', () => {
    expectCDK(stack).to(haveResource('AWS::KinesisFirehose::DeliveryStream', {}))
  })
})
