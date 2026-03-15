import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { argsParser } from './utils/argParser.js'
import { useStore } from './state/currentDirectory.js'
import { printCurrentDirectory } from './utils/pathResolver.js'
import { paintText } from './utils/paintText.js'
import { repl } from './repl.js'

const app = () => {
  const { initWorkingDirectory, getCurrentWorkingDir } = useStore()
  initWorkingDirectory()
  const currentDir = getCurrentWorkingDir()

  const rl = readline.createInterface({ input, output, prompt: '> ' })

  console.log(paintText('Welcome to Data Processing CLI!', 'magenta'))
  printCurrentDirectory(currentDir)

  rl.prompt()

  rl.on('line', async line => {
    if (line.trim() === '.exit') {
      rl.close()
      return
    }

    const { command, args } = argsParser(line)
    await repl(command, args)
    rl.prompt()
  })

  rl.on('SIGINT', () => {
    rl.close()
  })

  rl.on('close', () => {
    console.log(paintText('Thank you for using Data Processing CLI!', 'magenta'))
  })

  process.on('.exit', () => rl.close())
}

app()
