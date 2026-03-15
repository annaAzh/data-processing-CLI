import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { paintText } from '../utils/paintText.js'
import { Transform } from 'node:stream'

const ALLOWED_ALGORITHM = ['sha256', 'md5', 'sha512']

export const hashCommand = async (inputPath, algorithm = 'sha256', savePath) => {
  if (algorithm && !ALLOWED_ALGORITHM.includes(algorithm)) {
    console.log(paintText('Operation failed', 'red'))
    return
  }

  try {
    const hash = createHash(algorithm)
    const rs = createReadStream(inputPath)

    await pipeline(rs, hash)

    const result = hash.digest('hex')
    process.stdout.write(`${algorithm}: ${result}\n`)

    if (savePath) {
      const fileName = basename(inputPath)
      const outputPath = resolve(dirname(inputPath), `${fileName}.${algorithm}`)
      const ws = createWriteStream(outputPath)
      ws.write(result)
      ws.end()
    }
  } catch {
    console.log(paintText('Operation failed', 'red'))
  }
}
