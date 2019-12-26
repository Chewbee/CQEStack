import { CQEStack } from '../src/CQEStack'
import { CommandStack } from '../src/command_stack'
import { QueryStack } from '../src/query_stack'
import { EventBridgeStack } from '../src/eventBridgeStack'
import cdk = require ('@aws-cdk/core') ;

describe('CQE Stacks Tests', () => {
  const app = new cdk.App()
  const stack = new CQEStack(app, 'TestCQEStack')

  it(' CQE Stack Should contain a Command Stack ', () => {
    expect(stack.commands).toBeInstanceOf(CommandStack)
  })
  it(' CQE Stack Should contain a Query Stack ', () => {
    expect(stack.queries).toBeInstanceOf(QueryStack)
  })
  it(' CQE Stack Should contain an EventBridge Stack ', () => {
    expect(stack.eventBridge).toBeInstanceOf(EventBridgeStack)
  })
})
