#!/usr/bin/env node
import 'source-map-support/register'

import { OpenBankingStack } from '../src/open_banking-stack'

import cdk = require('@aws-cdk/core')

const app = new cdk.App()
const stack = new OpenBankingStack(app, 'OpenBankingStack')
