import { expect as expectCDK, matchTemplate, MatchStyle, haveResource, SynthUtils } from '@aws-cdk/assert'
import cdk = require('@aws-cdk/core');
import OpenBanking = require('../lib/open_banking-stack');

test('Stack built', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new OpenBanking.OpenBankingStack(app, 'MyTestStack')
  // THEN
  return undefined
  // expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
})
