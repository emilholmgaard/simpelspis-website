const fs = require('fs')
const path = require('path')

const recipesDir = path.join(__dirname, '../src/data/recipes')

// Read all recipe files
const files = fs.readdirSync(recipesDir).filter(file => file.endsWith('.json') && file !== 'index.json')

let updated = 0

files.forEach(file => {
  const filePath = path.join(recipesDir, file)
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  
  // Remove "Hjemmelavet " from title if it starts with it
  if (content.title && content.title.startsWith('Hjemmelavet ')) {
    const oldTitle = content.title
    content.title = content.title.replace(/^Hjemmelavet /, '')
    
    // Update excerpt and description if they also start with it
    if (content.excerpt && content.excerpt.startsWith('Hjemmelavet ')) {
      content.excerpt = content.excerpt.replace(/^Hjemmelavet /, '')
    }
    if (content.description && content.description.startsWith('Hjemmelavet ')) {
      content.description = content.description.replace(/^Hjemmelavet /, '')
    }
    
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8')
    console.log(`✓ Updated ${file}: "${oldTitle}" → "${content.title}"`)
    updated++
  }
})

// Update index.json
const indexPath = path.join(recipesDir, 'index.json')
const indexContent = JSON.parse(fs.readFileSync(indexPath, 'utf8'))

indexContent.forEach(recipe => {
  if (recipe.title && recipe.title.startsWith('Hjemmelavet ')) {
    const oldTitle = recipe.title
    recipe.title = recipe.title.replace(/^Hjemmelavet /, '')
    
    if (recipe.excerpt && recipe.excerpt.startsWith('Hjemmelavet ')) {
      recipe.excerpt = recipe.excerpt.replace(/^Hjemmelavet /, '')
    }
    
    console.log(`✓ Updated index.json: "${oldTitle}" → "${recipe.title}"`)
  }
})

fs.writeFileSync(indexPath, JSON.stringify(indexContent, null, 2) + '\n', 'utf8')

console.log(`\n✅ Updated ${updated} recipe files and index.json`)
console.log('✅ Removed "Hjemmelavet " prefix from all titles')


