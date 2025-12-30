#!/usr/bin/env node

/**
 * Find Unused Components Script
 * 
 * Analyzes the codebase to identify React components that are never imported or used.
 * Handles static imports, dynamic imports, and component mapping systems.
 */

const fs = require('fs')
const path = require('path')

// Configuration
const COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components')
const SRC_DIR = path.join(__dirname, '..', 'src')
const COMPONENT_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']
const EXCLUDE_DIRS = ['node_modules', '.next', 'dist', 'build']

// Results storage
const components = new Map() // filePath -> { exports: [], filePath, relativePath }
const usageMap = new Map() // componentPath -> Set of files using it

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      const dirName = path.basename(filePath)
      if (!EXCLUDE_DIRS.includes(dirName) && !dirName.startsWith('.')) {
        getAllFiles(filePath, arrayOfFiles)
      }
    } else if (COMPONENT_EXTENSIONS.some(ext => file.endsWith(ext))) {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

/**
 * Extract component name from file path
 */
function getComponentNameFromPath(filePath) {
  const basename = path.basename(filePath, path.extname(filePath))
  // Handle index files - use parent directory name
  if (basename === 'index') {
    const parentDir = path.basename(path.dirname(filePath))
    return parentDir.charAt(0).toUpperCase() + parentDir.slice(1).replace(/-/g, '')
  }
  return basename
}

/**
 * Extract exports from a component file
 */
function extractExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const exports = {
    default: null,
    named: []
  }

  // Extract default export - multiple patterns
  // Pattern 1: export default ComponentName
  const defaultExportMatch = content.match(/export\s+default\s+(\w+)/)
  if (defaultExportMatch) {
    exports.default = defaultExportMatch[1]
  } 
  // Pattern 2: export default function ComponentName
  else {
    const defaultFunctionMatch = content.match(/export\s+default\s+function\s+(\w+)/)
    if (defaultFunctionMatch) {
      exports.default = defaultFunctionMatch[1]
    }
    // Pattern 3: export default class ComponentName
    else {
      const defaultClassMatch = content.match(/export\s+default\s+class\s+(\w+)/)
      if (defaultClassMatch) {
        exports.default = defaultClassMatch[1]
      }
      // Pattern 4: export default (anonymous, use filename)
      else if (content.includes('export default')) {
        exports.default = getComponentNameFromPath(filePath)
      }
    }
  }

  // Extract named exports - const/function/class/interface/type
  const namedExportRegex = /export\s+(?:const|function|class|interface|type|enum)\s+(\w+)/g
  let match
  while ((match = namedExportRegex.exec(content)) !== null) {
    if (!exports.named.includes(match[1])) {
      exports.named.push(match[1])
    }
  }

  // Extract from export { ... } syntax
  const exportBlockRegex = /export\s*\{\s*([^}]+)\s*\}/g
  while ((match = exportBlockRegex.exec(content)) !== null) {
    const exportedItems = match[1]
      .split(',')
      .map(item => {
        const trimmed = item.trim()
        // Handle "export { default as Name }"
        if (trimmed.includes(' as ')) {
          const parts = trimmed.split(/\s+as\s+/)
          return parts[parts.length - 1].trim()
        }
        // Handle "export { Name }"
        return trimmed.split(/\s+/)[0]
      })
      .filter(item => item && !item.startsWith('type ') && !item.startsWith('interface '))
    
    exports.named.push(...exportedItems.filter(item => !exports.named.includes(item)))
  }

  // Extract from export * from syntax (re-exports)
  const reExportRegex = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g
  while ((match = reExportRegex.exec(content)) !== null) {
    // Mark that this file re-exports from another file
    // We'll need to check the re-exported file separately
    const importPath = match[1]
    const fromDir = path.dirname(filePath)
    const srcRoot = path.join(__dirname, '..', 'src')
    
    // Resolve the import path
    let reExportPath
    if (importPath.startsWith('~/')) {
      reExportPath = path.join(srcRoot, importPath.slice(2))
    } else if (importPath.startsWith('@/')) {
      reExportPath = path.join(srcRoot, importPath.slice(2))
    } else if (importPath.startsWith('.')) {
      reExportPath = path.resolve(fromDir, importPath)
    } else {
      reExportPath = path.join(srcRoot, importPath)
    }
    
    // Try to find the file and get its exports
    const possiblePaths = [
      reExportPath + '.tsx',
      reExportPath + '.ts',
      reExportPath + '.jsx',
      reExportPath + '.js',
      path.join(reExportPath, 'index.tsx'),
      path.join(reExportPath, 'index.ts'),
      path.join(reExportPath, 'index.jsx'),
      path.join(reExportPath, 'index.js'),
    ]
    
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        const reExported = extractExports(possiblePath)
        if (reExported.default && !exports.named.includes(reExported.default)) {
          exports.named.push(reExported.default)
        }
        exports.named.push(...reExported.named.filter(n => !exports.named.includes(n)))
        break
      }
    }
  }

  return exports
}

/**
 * Normalize import path to match component file paths
 */
function normalizeImportPath(importPath, fromFile) {
  // Remove quotes
  importPath = importPath.replace(/['"]/g, '')

  const srcRoot = path.join(__dirname, '..', 'src')
  const componentsRoot = path.join(__dirname, '..', 'src', 'components')

  // Handle aliases (~, @, etc.)
  if (importPath.startsWith('~/')) {
    importPath = path.join(srcRoot, importPath.slice(2))
  } else if (importPath.startsWith('@/')) {
    importPath = path.join(srcRoot, importPath.slice(2))
  } else if (importPath.startsWith('~/components/')) {
    importPath = path.join(componentsRoot, importPath.slice(14))
  }

  // Handle relative paths
  if (importPath.startsWith('.')) {
    const fromDir = path.dirname(fromFile)
    const resolved = path.resolve(fromDir, importPath)
    importPath = resolved
  } else if (!path.isAbsolute(importPath)) {
    // Try resolving from src root
    const resolved = path.resolve(srcRoot, importPath)
    if (fs.existsSync(resolved) || fs.existsSync(resolved + '.tsx') || fs.existsSync(resolved + '.ts')) {
      importPath = resolved
    }
  }

  // Normalize path separators and remove extensions
  return importPath.replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, '')
}

/**
 * Check if a component is used in a file
 */
function checkComponentUsage(componentPath, componentName, exports, searchFile) {
  if (!fs.existsSync(searchFile)) return false

  const content = fs.readFileSync(searchFile, 'utf-8')
  const normalizedComponentPath = componentPath.replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, '')
  const relativeComponentPath = path.relative(SRC_DIR, componentPath).replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, '')
  const componentPathWithoutExt = componentPath.replace(/\.(tsx?|jsx?)$/, '')
  
  // Get various path representations
  const pathVariants = [
    normalizedComponentPath,
    relativeComponentPath,
    componentPathWithoutExt.replace(/\\/g, '/'),
    path.relative(COMPONENTS_DIR, componentPath).replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, ''),
    // Path with ~/components/ prefix
    '~/components/' + path.relative(COMPONENTS_DIR, componentPath).replace(/\\/g, '/').replace(/\.(tsx?|jsx?)$/, ''),
    // Path without index
    relativeComponentPath.replace(/\/index$/, ''),
  ]

  // Check for direct imports
  const importPatterns = [
    // import Component from 'path'
    new RegExp(`import\\s+${componentName}\\s+from\\s+['"]([^'"]+)['"]`, 'g'),
    // import { Component } from 'path'
    new RegExp(`import\\s*\\{[^}]*\\b${componentName}\\b[^}]*\\}\\s+from\\s+['"]([^'"]+)['"]`, 'g'),
    // import * as Component from 'path'
    new RegExp(`import\\s*\\*\\s+as\\s+${componentName}\\s+from\\s+['"]([^'"]+)['"]`, 'g'),
    // export { default as Component } from 'path'
    new RegExp(`export\\s*\\{[^}]*default\\s+as\\s+\\w+[^}]*\\}\\s+from\\s+['"]([^'"]+)['"]`, 'g'),
    // Dynamic import: import('path')
    new RegExp(`import\\s*\\(\\s*['"]([^'"]+)['"]\\s*\\)`, 'g'),
    // next/dynamic: dynamic(() => import('path'))
    new RegExp(`dynamic\\s*\\(\\s*\\(\\)\\s*=>\\s*import\\s*\\(\\s*['"]([^'"]+)['"]\\s*\\)\\s*\\)`, 'g'),
    // require('path')
    new RegExp(`require\\s*\\(\\s*['"]([^'"]+)['"]\\s*\\)`, 'g'),
  ]

  for (const pattern of importPatterns) {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const importedPath = normalizeImportPath(match[1], searchFile)
      
      // Check if import path matches any variant of component path
      for (const variant of pathVariants) {
        const variantNormalized = variant.replace(/\\/g, '/')
        if (importedPath === variantNormalized || 
            importedPath.endsWith(variantNormalized) ||
            variantNormalized.endsWith(importedPath)) {
          return true
        }
      }
    }
  }

  // Check for string references (for component mapping systems)
  // This is less precise but catches cases like component: ComponentName
  const stringPatterns = [
    // Component name in quotes
    new RegExp(`['"]${componentName}['"]`, 'g'),
    // Component path in quotes
    new RegExp(`['"]${relativeComponentPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'),
    // Component in mapping object
    new RegExp(`component:\\s*${componentName}\\b`, 'g'),
    // Component in array/object
    new RegExp(`\\b${componentName}\\s*[,:}]`, 'g'),
  ]

  for (const pattern of stringPatterns) {
    if (pattern.test(content)) {
      return true
    }
  }

  // Check for file path references in comments or strings
  for (const variant of pathVariants) {
    const escapedVariant = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const filePathPattern = new RegExp(escapedVariant, 'g')
    if (filePathPattern.test(content)) {
      return true
    }
  }

  return false
}

/**
 * Check if component is used in component mapping systems
 */
function checkComponentMappingUsage(componentPath, componentInfo, usedIn) {
  // Check FEATURE_SLUG_COMPONENTS in featureSlugComponents.ts
  const featureSlugFile = path.join(SRC_DIR, 'config', 'featureSlugComponents.ts')
  if (fs.existsSync(featureSlugFile)) {
    const content = fs.readFileSync(featureSlugFile, 'utf-8')
    const componentName = componentInfo.defaultExport || componentInfo.componentName
    const relativePath = path.relative(SRC_DIR, componentPath).replace(/\\/g, '/')
    
    // Check if component is imported or referenced
    if (content.includes(componentName) || content.includes(relativePath)) {
      usedIn.add(featureSlugFile)
    }
  }

  // Check SLUG_COMPONENT_MAP in DynamicComponentRenderer
  const dynamicRendererFile = path.join(SRC_DIR, 'components', 'dynamic', 'DynamicComponentRenderer.tsx')
  if (fs.existsSync(dynamicRendererFile)) {
    const content = fs.readFileSync(dynamicRendererFile, 'utf-8')
    const componentName = componentInfo.defaultExport || componentInfo.componentName
    
    // Check if component is imported
    if (content.includes(componentName)) {
      usedIn.add(dynamicRendererFile)
    }
  }

  // Check componentMap in blockEditor/DynamicComponent.tsx
  const blockEditorFile = path.join(SRC_DIR, 'components', 'blockEditor', 'DynamicComponent.tsx')
  if (fs.existsSync(blockEditorFile)) {
    const content = fs.readFileSync(blockEditorFile, 'utf-8')
    const componentName = componentInfo.defaultExport || componentInfo.componentName
    const relativePath = path.relative(COMPONENTS_DIR, componentPath).replace(/\\/g, '/')
    
    // Check if component is imported or in componentMap
    if (content.includes(componentName) || content.includes(relativePath)) {
      usedIn.add(blockEditorFile)
    }
  }

  // Check Sanity schemas - components might be referenced in schemas
  const schemasDir = path.join(SRC_DIR, 'schemas')
  if (fs.existsSync(schemasDir)) {
    const schemaFiles = getAllFiles(schemasDir)
    for (const schemaFile of schemaFiles) {
      const content = fs.readFileSync(schemaFile, 'utf-8')
      const componentName = componentInfo.defaultExport || componentInfo.componentName
      const relativePath = path.relative(SRC_DIR, componentPath).replace(/\\/g, '/')
      
      // Check if component is imported or referenced in schema
      if (content.includes(componentName) || 
          (content.includes('component') && content.includes(relativePath))) {
        usedIn.add(schemaFile)
      }
    }
  }
}

/**
 * Get all source files to search
 */
function getAllSourceFiles() {
  const files = []
  
  function traverse(dir) {
    const entries = fs.readdirSync(dir)
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)
      const basename = path.basename(fullPath)
      
      if (stat.isDirectory()) {
        if (!EXCLUDE_DIRS.includes(basename) && !basename.startsWith('.')) {
          traverse(fullPath)
        }
      } else if (COMPONENT_EXTENSIONS.some(ext => basename.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  }
  
  traverse(SRC_DIR)
  return files
}

/**
 * Main analysis function
 */
function analyzeComponents() {
  console.log('🔍 Scanning for components...\n')

  // Step 1: Find all component files
  const componentFiles = getAllFiles(COMPONENTS_DIR)
  console.log(`Found ${componentFiles.length} component files\n`)

  // Step 2: Extract exports from each component
  for (const filePath of componentFiles) {
    const relativePath = path.relative(COMPONENTS_DIR, filePath)
    const exports = extractExports(filePath)
    const componentName = getComponentNameFromPath(filePath)

    // For index files, also check what they re-export
    const reExportedComponents = []
    if (path.basename(filePath, path.extname(filePath)) === 'index') {
      const content = fs.readFileSync(filePath, 'utf-8')
      const reExportMatches = content.matchAll(/export\s*\{\s*default\s+as\s+(\w+)\s*\}\s+from\s+['"]([^'"]+)['"]/g)
      for (const match of reExportMatches) {
        const exportedName = match[1]
        const importPath = match[2]
        const fromDir = path.dirname(filePath)
        const srcRoot = path.join(__dirname, '..', 'src')
        
        // Resolve the import path
        let sourcePath
        if (importPath.startsWith('~/')) {
          sourcePath = path.join(srcRoot, importPath.slice(2))
        } else if (importPath.startsWith('@/')) {
          sourcePath = path.join(srcRoot, importPath.slice(2))
        } else if (importPath.startsWith('.')) {
          sourcePath = path.resolve(fromDir, importPath)
        } else {
          sourcePath = path.join(srcRoot, importPath)
        }
        
        // Try to find the actual file
        const possiblePaths = [
          sourcePath + '.tsx',
          sourcePath + '.ts',
          sourcePath + '.jsx',
          sourcePath + '.js',
        ]
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            reExportedComponents.push({
              name: exportedName,
              sourceFile: possiblePath
            })
            break
          }
        }
      }
    }

    components.set(filePath, {
      filePath,
      relativePath,
      componentName,
      exports,
      defaultExport: exports.default || componentName,
      reExportedComponents
    })
  }

  // Step 3: Find all source files to search
  console.log('🔍 Scanning source files for component usage...\n')
  const sourceFiles = getAllSourceFiles()

  // Step 4: Check usage of each component
  for (const [componentPath, componentInfo] of components) {
    const usedIn = new Set()

    for (const sourceFile of sourceFiles) {
      // Skip the component file itself
      if (sourceFile === componentPath) continue

      // Check default export
      if (componentInfo.defaultExport) {
        if (checkComponentUsage(componentPath, componentInfo.defaultExport, componentInfo.exports, sourceFile)) {
          usedIn.add(sourceFile)
        }
      }

      // Check named exports
      for (const namedExport of componentInfo.exports.named) {
        if (checkComponentUsage(componentPath, namedExport, componentInfo.exports, sourceFile)) {
          usedIn.add(sourceFile)
        }
      }

      // Check by component name
      if (checkComponentUsage(componentPath, componentInfo.componentName, componentInfo.exports, sourceFile)) {
        usedIn.add(sourceFile)
      }

      // Check re-exported components (for index files)
      for (const reExported of componentInfo.reExportedComponents) {
        if (checkComponentUsage(reExported.sourceFile, reExported.name, { default: reExported.name, named: [] }, sourceFile)) {
          usedIn.add(sourceFile)
        }
      }
    }

    // Also check if this component is re-exported by an index file
    // If an index file re-exports it, the component is considered used
    const componentDir = path.dirname(componentPath)
    const indexFiles = [
      path.join(componentDir, 'index.tsx'),
      path.join(componentDir, 'index.ts'),
      path.join(componentDir, 'index.jsx'),
      path.join(componentDir, 'index.js'),
    ]
    
    for (const indexFile of indexFiles) {
      if (fs.existsSync(indexFile) && indexFile !== componentPath) {
        const indexContent = fs.readFileSync(indexFile, 'utf-8')
        const componentRelativePath = './' + path.basename(componentPath)
        const componentName = componentInfo.defaultExport || componentInfo.componentName
        
        // Check if this component is re-exported
        if (indexContent.includes(componentRelativePath) || 
            indexContent.includes(componentName) ||
            indexContent.includes(path.basename(componentPath, path.extname(componentPath)))) {
          usedIn.add(indexFile)
        }
      }
    }

    // Special case: Check component mapping systems
    checkComponentMappingUsage(componentPath, componentInfo, usedIn)

    usageMap.set(componentPath, usedIn)
  }

  // Step 5: Generate report
  generateReport()
}

/**
 * Generate and display report
 */
function generateReport() {
  const unused = []
  const used = []

  for (const [componentPath, usedIn] of usageMap) {
    const componentInfo = components.get(componentPath)
    
    if (usedIn.size === 0) {
      unused.push({
        ...componentInfo,
        usageCount: 0
      })
    } else {
      used.push({
        ...componentInfo,
        usageCount: usedIn.size,
        usedIn: Array.from(usedIn)
      })
    }
  }

  // Sort unused by path
  unused.sort((a, b) => a.relativePath.localeCompare(b.relativePath))

  // Print report
  console.log('='.repeat(80))
  console.log('📊 COMPONENT USAGE ANALYSIS REPORT')
  console.log('='.repeat(80))
  console.log(`\nTotal Components: ${components.size}`)
  console.log(`✅ Used Components: ${used.length}`)
  console.log(`❌ Unused Components: ${unused.length}`)
  console.log(`Usage Rate: ${((used.length / components.size) * 100).toFixed(1)}%\n`)

  if (unused.length > 0) {
    console.log('='.repeat(80))
    console.log('❌ UNUSED COMPONENTS')
    console.log('='.repeat(80))
    console.log()

    // Group by directory
    const byDirectory = {}
    for (const component of unused) {
      const dir = path.dirname(component.relativePath)
      if (!byDirectory[dir]) {
        byDirectory[dir] = []
      }
      byDirectory[dir].push(component)
    }

    for (const [dir, components] of Object.entries(byDirectory).sort()) {
      console.log(`\n📁 ${dir || 'root'}/`)
      for (const component of components) {
        console.log(`   • ${path.basename(component.filePath)}`)
        console.log(`     Path: ${component.relativePath}`)
        if (component.exports.default) {
          console.log(`     Default Export: ${component.exports.default}`)
        }
        if (component.exports.named.length > 0) {
          console.log(`     Named Exports: ${component.exports.named.join(', ')}`)
        }
        console.log()
      }
    }
  }

  // Save to JSON file
  const reportData = {
    summary: {
      total: components.size,
      used: used.length,
      unused: unused.length,
      usageRate: ((used.length / components.size) * 100).toFixed(1) + '%'
    },
    unused: unused.map(c => ({
      filePath: c.filePath,
      relativePath: c.relativePath,
      componentName: c.componentName,
      defaultExport: c.exports.default,
      namedExports: c.exports.named
    })),
    used: used.map(c => ({
      filePath: c.filePath,
      relativePath: c.relativePath,
      componentName: c.componentName,
      usageCount: c.usageCount,
      usedIn: c.usedIn.map(f => path.relative(SRC_DIR, f))
    }))
  }

  const reportPath = path.join(__dirname, '..', 'unused-components-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
  console.log(`\n📄 Detailed report saved to: ${reportPath}`)
  console.log('='.repeat(80))
}

// Run analysis
if (require.main === module) {
  try {
    analyzeComponents()
  } catch (error) {
    console.error('❌ Error analyzing components:', error)
    process.exit(1)
  }
}

module.exports = { analyzeComponents }

