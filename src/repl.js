import { upCommand, cdCommand, lsCommand } from './navigation.js'
import { useStore } from './state/currentDirectory.js'
import { printCurrentDirectory } from './utils/pathResolver.js'
import { access } from 'node:fs/promises'
import { csvToJson, countCommand, jsonToCsv, hashCommand } from './commands/index.js'
import { paintText } from './utils/paintText.js'
import { parsePath } from './utils/argParser.js'

export const repl = async (command, args) => {
  const { getCurrentWorkingDir, setCurrentWorkingDirectory } = useStore()
  const currentPath = getCurrentWorkingDir()

  try {
    switch (command) {
      case 'up': {
        const targetPath = upCommand(currentPath)
        printCurrentDirectory(targetPath)
        setCurrentWorkingDirectory(targetPath)
        break
      }
      case 'cd': {
        const targetPath = await cdCommand(currentPath, args)
        printCurrentDirectory(targetPath)
        setCurrentWorkingDirectory(targetPath)
        break
      }
      case 'ls': {
        await lsCommand(currentPath)
        printCurrentDirectory(currentPath)
        break
      }
      case 'csv-to-json': {
        const index = args.indexOf('--input')
        if (index === -1) throw new Error('Operation failed')
        const inputPath = args[index + 1]
        await access(inputPath)

        const indexOutput = args.indexOf('--output')
        const outputPath = args[indexOutput + 1]

        csvToJson(inputPath, outputPath)
        printCurrentDirectory(currentPath)
        break
      }
      case 'json-to-csv': {
        const index = args.indexOf('--input')
        if (index === -1) throw new Error('Operation failed')
        const inputPath = args[index + 1]
        await access(inputPath)

        const indexOutput = args.indexOf('--output')
        const outputPath = args[indexOutput + 1]

        jsonToCsv(inputPath, outputPath)
        printCurrentDirectory(currentPath)
        break
      }
      case 'count': {
        const index = args.indexOf('--input')
        if (index === -1) throw new Error('Operation failed')
        const inputPath = args[index + 1]
        await access(inputPath)

        countCommand(inputPath)
        printCurrentDirectory(currentPath)
        break
      }
      case 'hash': {
        const index = args.indexOf('--input')
        if (index === -1) throw new Error('Operation failed')
        const inputPath = args[index + 1]
        await access(inputPath)

        const indexAlg = args.indexOf('--algorithm')
        const algorithm = indexAlg === -1 ? 'sha256' : args[indexAlg + 1]

        const indexSave = args.indexOf('--save')
        const save = indexSave === -1 ? undefined : args[indexSave + 1]

        await hashCommand(inputPath, algorithm, save)
      }
      default:
        console.log(paintText('Invalid input', 'yellow'))
    }
  } catch {
    console.log(paintText('Operation failed', 'red'))
  }
}
