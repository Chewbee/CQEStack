
export const handler = async (event: any = {}): Promise<any> => {
  return {
    statusCode: 200,
    headers: {
    },
    body: JSON.stringify({
      message: 'getStatus returned',
      input: event
    })
  }
}
