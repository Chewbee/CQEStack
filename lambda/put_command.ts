import { } from '../lib/command_stack'
import uuid = require ('uuid');
import AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient()

const TABLE_NAME = process.env.TABLE_NAME || 'commandsTable'
const PRIMARY_KEY = process.env.PRIMARY_KEY || 'itemId'
const RESERVED_RESPONSE = 'Error: You\'re using AWS reserved keywords as attributes'
const DYNAMODB_EXECUTION_ERROR = 'Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.'

// export function put_command( msg: object ) {
export const putCommand = async (event: any = {}): Promise<any> => {
  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' }
  }
  const ddbTtl = '604800' // 1 week
  const item = typeof event.body === 'object' ? event.body : JSON.parse(event.body)
  item[PRIMARY_KEY] = uuid()
  const params = {
    TableName: TABLE_NAME,
    Item: item,
    ddbTtl: process.env.TTL
    // should have TTL ?
  }
  try {
    await db.put(params).promise()
    return { statusCode: 201, body: event.body }
  } catch (dbError) {
    const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword')
      ? DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE
    return { statusCode: 500, body: errorResponse }
  }
}
