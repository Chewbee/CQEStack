/* eslint-disable no-unused-vars */
import { StackProps, Construct } from '@aws-cdk/core'
import { Function as LambdaFunction, Runtime, Code } from '@aws-cdk/aws-lambda'

export interface QueryStackProps extends StackProps
{
}
export class QueryConstruct extends Construct {
  private getStatus: LambdaFunction

  constructor (scope: Construct, id: string, props: QueryStackProps = {}) {
    super(scope, id)

    this.getStatus = new LambdaFunction(this, 'getStatus', {
      runtime: Runtime.NODEJS_10_X,
      code: Code.fromAsset('lambda'),
      handler: 'getStatus.handler'
    })
  }
}
