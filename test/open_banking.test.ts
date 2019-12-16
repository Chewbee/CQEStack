import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import OpenBanking = require('../lib/open_banking-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new OpenBanking.OpenBankingStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});