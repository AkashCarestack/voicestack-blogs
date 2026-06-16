const fs = require('fs')
const path = require('path')

const srcRoot = path.join(__dirname, '../resources/src/pages')
const destRoot = path.join(__dirname, '../src/pages/resources')
const DATA_EXPORTS = ['getStaticProps', 'getStaticPaths', 'getServerSideProps', 'config']

function detectExports(srcPath) {
  const src = fs.readFileSync(srcPath, 'utf8')
  const names = new Set(['default'])
  for (const name of DATA_EXPORTS) {
    const patterns = [
      new RegExp(`export\\s+(async\\s+)?function\\s+${name}\\b`),
      new RegExp(`export\\s+const\\s+${name}\\b`),
      new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}`),
    ]
    if (patterns.some((p) => p.test(src))) names.add(name)
  }
  return [...names]
}

function walk(rel = '') {
  const abs = path.join(srcRoot, rel)
  for (const name of fs.readdirSync(abs)) {
    if (['_app.tsx', 'studio', 'api', 'index.tsx'].includes(name) && rel === '') continue
    const relPath = path.join(rel, name)
    const srcPath = path.join(srcRoot, relPath)
    const destPath = path.join(destRoot, relPath)

    // Never write into resources source — only into src/pages/resources
    if (!destPath.startsWith(destRoot)) continue

    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      walk(relPath)
      continue
    }
    if (!/\.(tsx|ts|jsx|js)$/.test(name)) continue
    const relImport = path
      .relative(path.dirname(destPath), srcPath)
      .replace(/\\/g, '/')
      .replace(/\.(tsx|ts|jsx|js)$/, '')
    const importPath = relImport.startsWith('.') ? relImport : `./${relImport}`
    const exports = detectExports(srcPath)
    fs.writeFileSync(destPath, `export { ${exports.join(', ')} } from '${importPath}'\n`)
  }
}

walk('')

const apiSrc = path.join(__dirname, '../resources/src/pages/api')
const apiDest = path.join(__dirname, '../src/pages/api/resources')
fs.mkdirSync(apiDest, { recursive: true })
for (const name of fs.readdirSync(apiSrc)) {
  const srcPath = path.join(apiSrc, name)
  if (!fs.statSync(srcPath).isFile()) continue
  const destPath = path.join(apiDest, name)
  const relImport = path
    .relative(path.dirname(destPath), srcPath)
    .replace(/\\/g, '/')
    .replace(/\.(tsx|ts|jsx|js)$/, '')
  const importPath = relImport.startsWith('.') ? relImport : `./${relImport}`
  fs.writeFileSync(destPath, `export { default } from '${importPath}'\n`)
}

console.log('Synced resources pages to src/pages/resources')
