import { createReadStream, createWriteStream } from 'node:fs'

export const jsonToCsv = (inputPath, outputPath) => {
  const rs = createReadStream(inputPath)
  const ws = createWriteStream(outputPath)

  let buffer = ''
  rs.on('data', chunk => {
    buffer += chunk.toString()
  })

  rs.on('end', () => {
    try {
      const data = JSON.parse(buffer)
      if (!Array.isArray(data)) {
        throw new Error('Operation failed')
      }
      if (data.length === 0) {
        ws.end()
        return
      }
      const titles = Object.keys(data[0])
      ws.write(titles.join(',') + '\n')

      for (const obj of data) {
        const arr = []
        for (const title of titles) {
          arr.push(obj[title] ?? '')
        }
        ws.write(arr.join(',') + '\n')
      }
      ws.end()
    } catch (error) {
      console.log('Operation failed')
    }
  })

  rs.on('error', () => console.log('Operation failed'))
}
