import { StackProps } from '@aws-cdk/core'
import lambda = require('@aws-cdk/aws-lambda')
import cdk = require('@aws-cdk/core')

export interface QueryStackProps extends StackProps
{
}

export class QueryStack extends cdk.Construct {
 private getStatus: lambda.Function
 private addGetStatus (stack: QueryStack) {
   this.getStatus = new lambda.Function(stack, 'getStatus', {
     runtime: lambda.Runtime.NODEJS_10_X,
     code: lambda.Code.fromAsset('lambda'),
     handler: 'getStatus.handler'
   })
 }

 constructor (scope: cdk.Construct, id: string, props: QueryStackProps = {}) {
   super(scope, id)

   this.getStatus = new lambda.Function(this, 'getStatus', {
     runtime: lambda.Runtime.NODEJS_10_X,
     code: lambda.Code.fromAsset('lambda'),
     handler: 'getStatus.handler'
   })
 }
}
