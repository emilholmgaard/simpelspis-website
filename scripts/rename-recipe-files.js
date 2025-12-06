const fs = require('fs')
const path = require('path')

const recipesDir = path.join(__dirname, '../src/data/recipes')

// Read all recipe files
const files = fs.readdirSync(recipesDir).filter(file => file.endsWith('.json') && file !== 'index.json' && file.startsWith('hjemmelavet-'))

let renamed = 0
const slugMap = {} // Map old slug to new slug

files.forEach(file => {
  const oldPath = path.join(recipesDir, file)
  const content = JSON.parse(fs.readFileSync(oldPath, 'utf8'))
  
  // Generate new filename by removing "hjemmelavet-" prefix
  const newFilename = file.replace(/^hjemmelavet-/, '')
  const newPath = path.join(recipesDir, newFilename)
  
  // Update slug in content
  const oldSlug = content.slug
  const newSlug = oldSlug.replace(/^hjemmelavet-/, '')
  content.slug = newSlug
  
  // Save updated content
  fs.writeFileSync(newPath, JSON.stringify(content, null, 2) + '\n', 'utf8')
  
  // Delete old file
  fs.unlinkSync(oldPath)
  
  slugMap[oldSlug] = newSlug
  console.log(`✓ Renamed ${file} → ${newFilename} (slug: ${oldSlug} → ${newSlug})`)
  renamed++
})

// Update index.json
const indexPath = path.join(recipesDir, 'index.json')
const indexContent = JSON.parse(fs.readFileSync(indexPath, 'utf8'))

indexContent.forEach(recipe => {
  if (recipe.slug && recipe.slug.startsWith('hjemmelavet-')) {
    const oldSlug = recipe.slug
    recipe.slug = oldSlug.replace(/^hjemmelavet-/, '')
    console.log(`✓ Updated index.json slug: ${oldSlug} → ${recipe.slug}`)
  }
})

fs.writeFileSync(indexPath, JSON.stringify(indexContent, null, 2) + '\n', 'utf8')

console.log(`\n✅ Renamed ${renamed} recipe files`)
console.log('✅ Updated slugs in all files and index.json')



