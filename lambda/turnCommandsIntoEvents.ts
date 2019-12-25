/* eslint-disable no-unused-vars */
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export async function handler (event: object, context: object): Promise<any> {
  console.log('Fired turnCommandsIntoEvents ! ')
  return {
    statusCode: 200,
    headers: {
    },
    body: JSON.stringify({
      message: 'Go Typescript',
      input: event
    })
  }
}
