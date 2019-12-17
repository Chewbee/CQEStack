import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import cdk = require('@aws-cdk/core');
import api = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');

test('Lambda Created', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')
  // WHEN
  const lambdaRestApi = new lambda.Function(stack, 'put_command', {
    runtime: lambda.Runtime.NODEJS_10_X,
    code: lambda.Code.fromAsset('lambda'),
    handler: 'put_command.putCommand'
  })
  // THEN
  expectCDK(stack).to(haveResource('AWS::Lambda::Function', {
    Runtime: 'nodejs10.x',
    Handler: 'put_command.putCommand'
  }))
})

test('API Gateway Created', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const lambdaRestApi = new api.LambdaRestApi(stack, 'LambdaRestApi', {
    restApiName: 'Put Command Service',
    description: 'This service receives the command',
    handler: new lambda.Function(stack, 'putCommand', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'put_command.putCommand'
    }),
    cloudWatchRole: true,
    deploy: true
  })

  // THEN
  expectCDK(stack).to(haveResource('AWS::ApiGateway::RestApi', {
    Name: 'Put Command Service'
  }))
})
