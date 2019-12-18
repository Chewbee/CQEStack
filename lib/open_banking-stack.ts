import { CommandStack } from './command_stack'
import cdk = require('@aws-cdk/core');

export class OpenBankingStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here
    new CommandStack(this, 'Command Stack')
  }
}
