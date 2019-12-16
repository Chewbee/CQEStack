#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { OpenBankingStack } from '../lib/open_banking-stack';

const app = new cdk.App();
new OpenBankingStack(app, 'OpenBankingStack');
