#!/usr/bin/env node
import 'source-map-support/register'

import { CQEStack } from '../src/CQEStack'

import * as cdk from '@aws-cdk/core'

const app = new cdk.App()
const stack = new CQEStack(app, 'CQEStack')
