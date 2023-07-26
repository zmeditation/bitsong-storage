type ResponseType = { message: string; statusCode?: string; error?: string }

/**
 * Create generic respose for all api
 * @param message {string} Main message
 * @param status {string=} StatusCode
 * @param error {string=} Error number (presented as a string)
 * @return {ResponseType} Object with all paramaters
 */
function createResponse(message: string, status?: string, error?: string): ResponseType {
  const response: ResponseType = {
    message,
  }

  if (status) {
    response.statusCode = status
  }

  if (error) {
    response.error = error
  }

  return response
}

function createDefaultSchema(successResponseSchema: any, properties: any): any {
  return {
    headers: { $ref: 'authSchema#' },
    response: {
      200: { description: 'Successful response', ...successResponseSchema },
      '4xx': { description: 'Error response', $ref: 'errorSchema#' },
    },
    ...properties,
  }
}

export { createResponse, createDefaultSchema }
