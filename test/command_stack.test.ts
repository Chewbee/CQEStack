import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'
import { CQEStack } from '../src/CQEStack'
import cdk = require('@aws-cdk/core')

describe('Command Stack Tests', () => {
  const app = new cdk.App()
  const stack = new CQEStack(app, 'TestCQEStack')

  it(' It Should contain a lambda function to put the commands into the dynamo DB', () => {
    expectCDK(stack).to(haveResource('AWS::Lambda::Function', {
      Runtime: 'nodejs10.x',
      Handler: 'putCommands.handler'
    }))
  })

  it(' It Should contain an eventSource mapping to link to theDynamoDB Stream', () => {
    expectCDK(stack).to(haveResource('AWS::Lambda::EventSourceMapping', {
      StartingPosition: 'TRIM_HORIZON',
      BatchSize: 1
    }))
  })

  it('It Should have an API Gateway Created', () => {
    expectCDK(stack).to(haveResource('AWS::ApiGateway::RestApi', {
      Name: 'Put Command Service',
      Description: 'This service receives the command'
    }))
  })

  it('It Should have a DynamoDB with a CommandsTable table ', () => {
    expectCDK(stack).to(haveResourceLike('AWS::DynamoDB::Table', {
      TableName: 'CommandsTable'
    }))
  })
})
