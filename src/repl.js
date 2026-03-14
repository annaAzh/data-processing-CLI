import { upCommand, cdCommand, lsCommand } from './navigation.js'
import { useStore } from './state/currentDirectory.js'
import { printCurrentDirectory } from './utils/pathResolver.js'
import { access } from 'node:fs/promises'
import { csvToJson } from './commands/index.js'

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
      default:
        console.log('Invalid input')
    }
  } catch {
    console.log('Operation failed')
  }
}
