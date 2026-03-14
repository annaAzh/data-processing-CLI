import { createReadStream, createWriteStream } from 'node:fs'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

export const csvToJson = async (inputPath, outputPath) => {
  const rs = createReadStream(inputPath)
  const ws = createWriteStream(outputPath)

  let title = ''
  let left = ''
  let isComma = true
  const transform = new Transform({
    transform(chunk, _encoding, callback) {
      left += chunk.toString()
      const lines = left.split(/\r?\n/)
      left = lines.pop()

      let output = ''

      for (const line of lines) {
        if (title.length === 0) {
          title = line.split(',')
          output += '[\n'
        } else {
          output += createJson(title, line)
          if (!isComma) output += ',\n'
          isComma = false
        }
      }

      callback(null, output)
    },
    flush(callback) {
      let output = ''
      if (left.length > 0) {
        if (!isComma) output += ',\n'
        output += createJson(title, left)
      }
      output += '\n]\n'
      callback(null, output)
    }
  })

  await pipeline(rs, transform, ws)
}

const createJson = (title, line) => {
  const values = line.split(',')
  const obj = {}

  for (let i = 0; i < title.length; i += 1) {
    obj[title[i]] = values[i]
  }
  return '  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ')
}
