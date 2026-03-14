import { getHomeDir } from '../utils/pathResolver.js'

export const store = {
  currentDirectory: null
}

export const useStore = () => {
  const setCurrentWorkingDirectory = newDirectory => {
    store.currentDirectory = newDirectory
  }

  const getCurrentWorkingDir = () => store.currentDirectory

  const initWorkingDirectory = () => {
    store.currentDirectory = getHomeDir()
  }

  return {
    setCurrentWorkingDirectory,
    getCurrentWorkingDir,
    initWorkingDirectory
  }
}
