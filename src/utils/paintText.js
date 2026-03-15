import { styleText } from 'node:util'

export const paintText = (text, color) => {
  return styleText(color, text)
}
