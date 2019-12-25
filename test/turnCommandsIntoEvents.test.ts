/* eslint-disable no-unused-vars */
import { handler } from '../lambda/turnCommandsIntoEvents'
import * as aws from 'aws-lambda'
describe('turnCommandsIntoEvents test Suite', () => {
  test('IT should returns a 200 statusCode and an inputted event', async () => {
    // GIVEN
    const event = { body: 'Test Body' } as object
    const context = {} as object
    // WHEN
    const result = await handler(event, context)
    const parsedResultBody = JSON.parse(result.body)
    // THEN
    expect(result.statusCode).toBe(200)
    expect(parsedResultBody.input).toStrictEqual(event)
  })
})
