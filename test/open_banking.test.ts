import { SynthUtils } from '@aws-cdk/assert'
import cdk = require('@aws-cdk/core')
import OpenBanking = require('../src/open_banking-stack')

test('Stack is conform with snapshot', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new OpenBanking.OpenBankingStack(app, 'MyTestStack')
  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
})
