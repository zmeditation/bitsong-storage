import { FastifyInstance } from 'fastify'
import { getConfig } from '../../../config'
import { fetch } from '@web-std/fetch'
import { File, Blob } from '@web-std/file'
import { transform } from 'streaming-iterables'
import { CarReader } from '@ipld/car'
import { pack } from 'ipfs-car/pack'
import { FsBlockStore as Blockstore } from 'ipfs-car/blockstore/fs'
import { TreewalkCarSplitter } from 'carbites/treewalk'
// for browser
// import { TreewalkCarSplitter } from 'https://cdn.skypack.dev/carbites/treewalk'
import { IPFSStorageProvider } from '@bitsongjs/storage'

export function toImportCandidate(file: { name: any; stream: () => any; }) {
  /** @type {ReadableStream} */
  let stream: any
  return {
    path: file.name,
    get content() {
      stream = stream || file.stream()
      return stream
    },
  }
}

export default async function routes(fastify: FastifyInstance) {
  //   fastify.addContentTypeParser(
  //     ['application/json', 'text/plain'],
  //     function (request, payload, done) {
  //       done(null)
  //     }
  //   )

  fastify.post('/', async (request, response) => {
    const contentType = request.headers['content-type']
    request.log.info(`content-type is ${contentType}`)

    const { fileSizeLimit, ipfsHost, ipfsProtocol, ipfsApiKey } = getConfig()

    if (contentType?.startsWith('multipart/form-data')) {
      const files = await request.files({ limits: { fileSize: fileSizeLimit, files: 10000 } })
      if (!files) {
        throw new Error('No file uploaded')
      }

      const input: File[] = []
      for await (const file of files) {
        if (file) {
          input.push(new File([await file.toBuffer()], file.filename))
        }
      }

      try {
        const ipfs = new IPFSStorageProvider(`${ipfsProtocol}://${ipfsHost}`, ipfsApiKey)
        const res = await ipfs.uploadAll(input)

        return response.status(200).send({
          cid: res,
        })
      } catch (e) {
        console.log('error', e)
      }
    } else {
      throw new Error('invalid content-type, must be multipart/form-data')
    }
  })
}
