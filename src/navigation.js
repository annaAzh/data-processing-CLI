import { resolve } from 'path'
import { getHomeDir } from './utils/pathResolver.js'
import { readdir } from 'fs/promises'
import { access } from 'node:fs/promises'

export const upCommand = currentPath => {
  const pathToUp = resolve(currentPath, '..')

  if (currentPath === getHomeDir()) {
    console.log(`You are already in ${getHomeDir()}`)
    return currentPath
  }
  return pathToUp
}

export const cdCommand = async (currentPath, args) => {
  const cdPath = resolve(currentPath, args[0])
  await access(cdPath)
  return cdPath
}

export const lsCommand = async currentPath => {
  const info = await readdir(currentPath, { withFileTypes: true })

  const sortedInfo = info
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) {
        return a.isDirectory() ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
    .map(item => ({ name: item.name, type: item.isDirectory() ? 'folder' : 'file' }))

  console.table(sortedInfo)
}
