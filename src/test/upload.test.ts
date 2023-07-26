'use strict'

import dotenv from 'dotenv'
import FormData from 'form-data'
import fs from 'fs'
import app from '../app'

dotenv.config({ path: '.env.test' })

/*
 * POST /object/:id
 * multipart upload
 */
describe('testing POST object via multipart upload', () => {
  test('return 200 when uploading a single file', async () => {
    const form = new FormData()
    form.append('file', fs.createReadStream(`./src/test/assets/picture.jpg`))

    const response = await app().inject({
      method: 'POST',
      url: '/upload',
      headers: Object.assign({}, form.getHeaders()),
      payload: form,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      cid: 'bafybeic2gpspyjgrh4yhv5s4ia52t72ozplcsazaybge2ri6nbcjja6uae',
    })
  })

  test('return 200 when uploading multiple files', async () => {
    const form = new FormData()
    form.append('file1', fs.createReadStream(`./src/test/assets/picture.jpg`))
    form.append('file2', fs.createReadStream(`./src/test/assets/picture2.jpg`))

    const response = await app().inject({
      method: 'POST',
      url: '/upload',
      headers: Object.assign({}, form.getHeaders()),
      payload: form,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      cid: 'bafybeifgxpornmhmboi3djqx7xaeexyagfngf55ser5tn5ad3byibsgz6a',
    })
  })
})
