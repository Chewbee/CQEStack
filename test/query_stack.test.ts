import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import { CQEStack } from '../src/CQEStack'
import cdk = require('@aws-cdk/core')
describe('Queries Stack Tests', () => {
  const app = new cdk.App()
  const stack = new CQEStack(app, 'TestCQEStack')
  it(' It Should contain a lambda function', () => {
    expectCDK(stack).to(haveResource('AWS::Lambda::Function', {
      Runtime: 'nodejs10.x',
      Handler: 'getStatus.handler'
    }))
  })
})
