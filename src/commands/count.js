import { createReadStream } from 'node:fs'
import { paintText } from '../utils/paintText.js'

export const countCommand = targetPath => {
  return new Promise((resolve, reject) => {
    const rs = createReadStream(targetPath)

    let left = ''
    let lines = 0
    let words = 0
    let characters = 0

    rs.on('data', chunk => {
      left += chunk.toString()

      const splitted = left.split(/\r?\n/)
      left = splitted.pop()

      for (const line of splitted) {
        lines += 1
        words += line.split(/\s+/).filter(Boolean).length
        characters += line.length + 1
      }
    })

    rs.on('end', () => {
      if (left) {
        lines += 1
        words += left.split(/\s+/).filter(Boolean).length
        characters += left.length
      }

      process.stdout.write(`Lines: ${lines}\n`)
      process.stdout.write(`Words: ${words}\n`)
      process.stdout.write(`Characters: ${characters}\n`)
      resolve()
    })

    rs.on('error', () => {
      console.log(paintText('Operation failed', 'red'))
      reject()
    })
  })
}
