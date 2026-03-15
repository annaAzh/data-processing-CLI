import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { paintText } from '../utils/paintText.js'
import { Transform } from 'node:stream'

const ALLOWED_ALGORITHM = ['sha256', 'md5', 'sha512']

export const hashCompare = async (inputPath, comparePath, algorithm) => {
  if (algorithm && !ALLOWED_ALGORITHM.includes(algorithm)) {
    console.log(paintText('Operation failed', 'red'))
    return
  }

  try {
    const hash = createHash(algorithm)
    const rs = createReadStream(inputPath)
    const hashReadStream = createReadStream(comparePath)

    const transform = new Transform({
      transform(chunk, _encoding, callback) {
        hash.update(chunk)
        callback()
      }
    })

    await pipeline(rs, transform)

    const calculatedHash = hash.digest('hex')

    let expectedHash = ''
    const compareFileTransform = new Transform({
      transform(chunk, _encoding, callback) {
        expectedHash += chunk.toString()
        callback()
      }
    })

    await pipeline(hashReadStream, compareFileTransform)

    const normalizeCalculated = calculatedHash.toLowerCase()
    const normalizedExpected = expectedHash.trim().toLowerCase()

    const result = normalizedExpected === normalizeCalculated ? 'OK' : 'MISMATCH'
    console.log(paintText(result, 'yellow'))
  } catch {
    console.log(paintText('Operation failed', 'red'))
  }
}
