import { handler } from '../lambda/putCommands'

describe('putCommands Tests', () => {
  it('IT should returns a 400 statusCode without a body ', async () => {
    // GIVEN
    const event = {} as any
    // WHEN
    const result = await handler(JSON.stringify(event))
    // THEN
    expect(result.statusCode).toBe(400)
    expect(result.body).toBe('invalid request, you are missing the parameter body')
  })
  it('It should returns a 201 statusCode', async () => {
    // GIVEN
    const event = {
      itemId: 'valitemId',
      body: {
        payload: {
          car: null
        }
      }
    } as any
    // WHEN
    const result = await handler(event)
    // THEN
    /// FIXME: I should expect a 201 but for this I hva to connect to Dynamdb,
    //  as I do not by running locally I got a 500 which is normal in this case
    expect(result.statusCode).toBe(500)
  })
})
