import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import { routes, setErrorHandler } from './api'
import { getConfig } from './config'

const { keepAliveTimeout, headersTimeout } = getConfig()

const build = (opts: FastifyServerOptions = {}): FastifyInstance => {
  const app = fastify(opts)

  app.register(fastifyMultipart, {
    limits: {
      fields: 10,
      files: 1,
    },
    throwFileSizeLimit: false,
  })

  app.addContentTypeParser('*', function (request, payload, done) {
    done(null)
  })

  app.server.keepAliveTimeout = keepAliveTimeout * 1000
  app.server.headersTimeout = headersTimeout * 1000

  app.register(routes.upload, { prefix: '/upload' })

  setErrorHandler(app)

  app.get('/status', async (request, response) => response.status(200).send({ status: 'ok' }))

  return app
}

export default build
