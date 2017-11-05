import { name } from '../package.json'

module.exports = (message) => {
  const now = new Date()
  const logStr = `[${name} @ ${now.toISOString()}] ${message}`
  console.log(logStr)
}
