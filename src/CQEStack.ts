import { CommandConstruct } from './command_stack'
import { QueryConstruct } from './query_stack'
import { EventBridgeConstruct } from './eventBridgeStack'
import cdk = require('@aws-cdk/core');

export class CQEStack extends cdk.Stack {
  public readonly commands: CommandConstruct
  public readonly queries: QueryConstruct
  public readonly eventBridge : EventBridgeConstruct
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    // The code that defines your stack goes here
    this.commands = new CommandConstruct(this, 'Command Stack')

    this.queries = new QueryConstruct(this, 'Queries Stack')

    this.eventBridge = new EventBridgeConstruct(this, 'eventBridge', {
      command2events: this.commands.turnCommandsIntoEvents
    })
  }
}
