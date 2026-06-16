import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../..')

export const resourcesTurbopackAliases = {
  '~/resources/': './resources/src/',
  '~/resources-config/': './resources/config/',
  '~/resources/integration/': './resources/integration/',
}

export const resourcesWebpackAliases = {
  '~/resources': path.resolve(projectRoot, 'resources/src'),
  '~/resources-config': path.resolve(projectRoot, 'resources/config'),
  '~/resources/integration': path.resolve(projectRoot, 'resources/integration'),
}
