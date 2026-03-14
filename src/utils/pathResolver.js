import { resolve } from 'path'
import os from 'node:os'

export const getCurrentDir = (homeDir, path) => resolve(homeDir, path)

export const printCurrentDirectory = directory => console.log(`You are currently in ${directory}`)

export const getHomeDir = os.homedir
