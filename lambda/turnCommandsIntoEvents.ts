/* eslint-disable no-unused-vars */
import { DynamoDB, DynamoDBStreams } from 'aws-sdk'

export async function handler (event: any = {}, context: object): Promise<any> {
  console.log('Fired turnCommandsIntoEvents ! ')
  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' }
  }
  const item = typeof event.body === 'object' ? event.body : JSON.parse(event.body)
  /*
  event.Records.forEach((record) => {
    console.log('Stream record: ', JSON.stringify(record, null, 2))

    if (record.eventName === 'INSERT') {
      var who = JSON.stringify(record.dynamodb.NewImage.Username.S)
      var when = JSON.stringify(record.dynamodb.NewImage.Timestamp.S)
      var what = JSON.stringify(record.dynamodb.NewImage.Message.S)
      var params = {
        Subject: 'A new bark from ' + who,
        Message: 'Woofer user ' + who + ' barked the following at ' + when + ':\n\n ' + what,
        TopicArn: 'arn:aws:sns:region:accountID:wooferTopic'
      }
      try {
        // await sns.publish( params, function ( err, data ).promise() )
        return { statusCode: 201, event }
      } catch (error) {
        console.error('Unable to send message. Error JSON:', JSON.stringify(error, null, 2))
        return { statusCode: 500, body: error }
      }
    }
    */
  return { statusCode: 201, body: event.body }
}
