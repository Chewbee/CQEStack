#!/usr/bin / env node
/* eslint-disable no-unused-vars */
import 'source-map-support/register'

import { CQEStack } from '../src/CQEStack'

import { App } from '@aws-cdk/core'

const app = new App()
const stack = new CQEStack(app, 'CQEStack')
