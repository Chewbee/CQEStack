import { CommandStack } from './command_stack'
import cdk = require('@aws-cdk/core');

export class OpenBankingStack extends cdk.Stack {
  public readonly commands: CommandStack
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // The code that defines your stack goes here
    this.commands = new CommandStack(this, 'Command Stack')
  }
}
