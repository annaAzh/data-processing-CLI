import { getHomeDir } from './pathResolver.js'
import { useStore } from '../state/currentDirectory.js'
import { resolve, dirname } from 'path'

export const argsParser = line => {
  const tokens = line.trim().match(/'([^']*)'|"([^"]*)"|([^\s]+)/g) || []
  const [command, ...rest] = tokens.map(arg => arg.replace(/^['"]|['"]$/g, ''))
  return { command, args: rest }
}

export const parsePath = line => {
  const { getCurrentWorkingDir } = useStore()

  let path = line.trim()

  if (path.startsWith('--')) {
    return path
  }

  if (path === '.' || path === './') {
    return getCurrentWorkingDir()
  }

  if (path === '..' || path === '../') {
    return dirname(getCurrentWorkingDir())
  }

  if (
    (path.startsWith('"') && path.endsWith('"')) ||
    (path.startsWith("'") && path.endsWith("'"))
  ) {
    path = path.slice(1, -1)
  }

  if (path.startsWith('~')) {
    return getHomeDir()
  }

  if (path.startsWith('/') || path.startsWith('\\')) {
    return path
  }

  if (
    path.startsWith('./') ||
    path.startsWith('../') ||
    path.startsWith('-') ||
    path.startsWith('.')
  ) {
    return resolve(getCurrentWorkingDir(), path)
  }

  return resolve(getCurrentWorkingDir(), path)
}
