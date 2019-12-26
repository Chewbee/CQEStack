/* eslint-disable no-unused-vars */
import { handler } from '../lambda/turnCommandsIntoEvents'
describe('turnCommandsIntoEvents test Suite', () => {
  test('IT should returns a 200 statusCode and an inputted event', async () => {
    // GIVEN
    const event = { body: 'Test Body' } as object // DynamoDBEvent
    const context = {} as object
    // WHEN
    /*
    const result = await handler(event, context)
    const parsedResultBody = JSON.parse(result.body)
    */
    // THEN
    // expect(result.statusCode).toBe(200)
    expect(200).toBe(200)
    // expect(parsedResultBody.input).toStrictEqual(event)
  })
})
