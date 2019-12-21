
import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import { OpenBankingStack } from '../lib/open_banking-stack'
import cdk = require('@aws-cdk/core');

describe('Open Banking Stacks Tests', () => {
  const app = new cdk.App()
  const stack = new OpenBankingStack(app, 'TestOpenBankingStack')

  it(' It Should contain a lambda function', () => {
    expectCDK(stack).to(haveResource('AWS::Lambda::Function', {
      Runtime: 'nodejs10.x',
      Handler: 'put_command.putCommand'
    }))
  })
  it('It Should have an API Gateway Created', () => {
    expectCDK(stack).to(haveResource('AWS::ApiGateway::RestApi', {
      Name: 'Put Command Service',
      Description: 'This service receives the command'
    }))
  })
  /*
  it('Should have an API Gateway with a POST handler @ root', () => {
    expect(stack.commands.lambdaRestApi).toHaveProperty()
  })
  */
  it('It Should have a DynamoDB', () => {
    expectCDK(stack).to(haveResource('AWS::DynamoDB::Table', {
      TableName: 'CommandsTable'
    }))
  })
})
