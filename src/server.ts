import { FastifyInstance } from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'

import build from './app'
import { getConfig } from './config'
;(async () => {
  const { port, host, requestIdHeader } = getConfig()

  const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = build({
    disableRequestLogging: true,
    requestIdHeader,
  })

  app.listen({ port, host }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })

  process.on('uncaughtException', (e) => {
    // logger.error(
    //   {
    //     error: normalizeRawError(e),
    //   },
    //   'uncaught exception'
    // )
    process.exit(1)
  })

  process.on('SIGTERM', async () => {
    try {
      await app.close()
      process.exit(0)
    } catch (e) {
      //logger.error('shutdown error', { error: e })
      process.exit(1)
    }
  })
})()
