import { resolve } from 'path'
import os from 'node:os'
import { paintText } from './paintText.js'

export const getCurrentDir = (homeDir, path) => resolve(homeDir, path)

export const printCurrentDirectory = directory =>
  console.log(paintText(`You are currently in ${directory}`, 'green'))

export const getHomeDir = os.homedir
