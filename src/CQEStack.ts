import { CommandStack } from './command_stack'
import { QueryStack } from './query_stack'
import { EventBridgeStack } from './eventBridgeStack'
import cdk = require('@aws-cdk/core');

export class CQEStack extends cdk.Stack {
  public readonly commands: CommandStack
  public readonly queries: QueryStack
  public readonly eventBridge : EventBridgeStack
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    // The code that defines your stack goes here
    this.commands = new CommandStack(this, 'Command Stack')

    this.queries = new QueryStack(this, 'Queries Stack')

    this.eventBridge = new EventBridgeStack(this, 'eventBridge', {
      command2events: this.commands.turnCommandsIntoEvents
    })
  }
}
