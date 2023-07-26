import { FastifyInstance } from 'fastify'
import upload from './upload'

export default async function routes(fastify: FastifyInstance) {
  // auth
  fastify.register(async function authorizationContext(fastify) {
    //fastify.register(jwt)

    fastify.register(upload)
  })

  // public
  // fastify.register(async (fastify) => {})
}
