import uuid = require ('uuid');

test('Test put_command test file ', () => {
  return undefined
})

test('uuid is working', () => {
  const uu: string = uuid()
  expect(uu).not.toBeUndefined()
})
