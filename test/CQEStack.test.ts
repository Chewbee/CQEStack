import { CQEStack } from '../src/CQEStack'
import { CommandConstruct } from '../src/command_stack'
import { QueryConstruct } from '../src/query_stack'
import { EventBridgeConstruct } from '../src/eventBridgeStack'
import cdk = require ('@aws-cdk/core') ;

describe('CQE Stacks Tests', () => {
  const app = new cdk.App()
  const stack = new CQEStack(app, 'TestCQEStack')

  it(' CQE Stack Should contain a Command Construct ', () => {
    expect(stack.commands).toBeInstanceOf(CommandConstruct)
  })
  it(' CQE Stack Should contain a Query Stack ', () => {
    expect(stack.queries).toBeInstanceOf(QueryConstruct)
  })
  it(' CQE Stack Should contain an EventBridge Stack ', () => {
    expect(stack.eventBridge).toBeInstanceOf(EventBridgeConstruct)
  })
})
