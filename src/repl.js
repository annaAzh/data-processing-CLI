import { upCommand, cdCommand, lsCommand } from './navigation.js'
import { useStore } from './state/currentDirectory.js'
import { printCurrentDirectory } from './utils/pathResolver.js'

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
      default:
        console.log('Invalid input')
    }
  } catch (error) {
    console.log(error.message, '!!!!!!!')
    console.log('Operation failed')
  }
}
