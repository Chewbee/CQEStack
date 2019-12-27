import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import { CQEStack } from '../src/CQEStack'
import { EventBridgeConstruct } from '../src/eventBridgeStack'
import { App } from '@aws-cdk/core'

describe('event Bridge Test suite', () => {
  // GIVEN
  const app = new App()
  const stack = new CQEStack(app, 'TestCQEStack')
  // THEN
  it('EventBridgeStack should contain a bucket', () => {
    expectCDK(stack).to(haveResource('AWS::S3::Bucket'))
  })
  it('EventBridgeStack should contain a role', () => {
    expectCDK(stack).to(haveResource('AWS::IAM::Role', {}))
  })
  it('EventBridgeStack should contain a delivery stream', () => {
    expectCDK(stack).to(haveResource('AWS::KinesisFirehose::DeliveryStream', {}))
  })
  it('EventBridgeStack should contain an EventBus', () => {
    expectCDK(stack).to(haveResource('AWS::Events::EventBus', {}))
  })
})
