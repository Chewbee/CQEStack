#!/usr/bin/env node
import 'source-map-support/register'
import { OpenBankingStack } from '../lib/open_banking-stack'
import cdk = require('@aws-cdk/core');

const app = new cdk.App()
new OpenBankingStack(app, 'OpenBankingStack')
