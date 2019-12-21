// import { putCommand } from '../lambda/put_command'
import uuid = require('uuid');

describe('uuid is working', () => {
  const uu: string = uuid()
  it('UUID must be defined', () => {
    expect(uu).not.toBeUndefined()
  })
})
