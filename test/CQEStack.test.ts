import { CQEStack } from '../src/CQEStack'
import { CommandStack } from '../src/command_stack'
import { QueryStack } from '../src/query_stack'
import cdk = require ('@aws-cdk/core') ;

describe('Open Banking Stacks Tests', () => {
  const app = new cdk.App()
  const stack = new CQEStack(app, 'TestCQEStack')

  it(' It Should contain a Command Stack ', () => {
    expect(stack.commands).toBeInstanceOf(CommandStack)
  })
  it(' It Should contain a Query Stack ', () => {
    expect(stack.queries).toBeInstanceOf(QueryStack)
  })
})
