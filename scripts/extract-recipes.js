#!/usr/bin/env node

/**
 * Script til at ekstrahere alle opskrifter fra hardcodede React-komponenter
 * og gemme dem som JSON-filer med ALT data inklusiv næringsindhold
 */

const fs = require('fs');
const path = require('path');

// Stier til filer
const LIST_PAGE = path.join(__dirname, '../src/app/opskrifter/page.tsx');
const DETAIL_PAGE = path.join(__dirname, '../src/app/opskrifter/[slug]/page.tsx');
const OUTPUT_DIR = path.join(__dirname, '../src/data/recipes');

// Opret output directory hvis den ikke findes
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Finder matching bracket position
 */
function findMatchingBracket(str, startPos, openChar = '[', closeChar = ']') {
  let depth = 0;
  let inString = false;
  let stringChar = null;
  
  for (let i = startPos; i < str.length; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : null;
    
    // Håndter strings
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      continue;
    }
    
    if (inString) continue;
    
    if (char === openChar) {
      depth++;
    } else if (char === closeChar) {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  
  return -1;
}

/**
 * Parser en string array fra kode
 */
function parseStringArray(content, startPos) {
  const arrayStart = content.indexOf('[', startPos);
  if (arrayStart === -1) return { items: [], endPos: startPos };
  
  const arrayEnd = findMatchingBracket(content, arrayStart);
  if (arrayEnd === -1) return { items: [], endPos: startPos };
  
  const arrayContent = content.substring(arrayStart + 1, arrayEnd);
  const items = [];
  
  // Parse items - håndter både 'string' og "string"
  const itemRegex = /['"]([^'"]*(?:\\.[^'"]*)*)['"]/g;
  let match;
  while ((match = itemRegex.exec(arrayContent)) !== null) {
    // Unescape string
    let item = match[1];
    item = item.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
    items.push(item);
  }
  
  return { items, endPos: arrayEnd + 1 };
}

/**
 * Parser opskrifter fra liste-siden (page.tsx)
 */
function parseListRecipes(content) {
  const recipes = [];
  
  // Find recipes array start
  const recipesStart = content.indexOf('const recipes = [');
  if (recipesStart === -1) {
    throw new Error('Kunne ikke finde recipes array i liste-siden');
  }
  
  // Find matching closing bracket
  const arrayStart = recipesStart + 'const recipes = ['.length;
  const arrayEnd = findMatchingBracket(content, arrayStart - 1, '[', ']');
  if (arrayEnd === -1) {
    throw new Error('Kunne ikke finde slutning på recipes array');
  }
  
  const recipesContent = content.substring(arrayStart, arrayEnd);
  
  // Parse hver opskrift - find alle recipe objects
  const recipeObjectRegex = /\{\s*slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*category:\s*['"]([^'"]+)['"],\s*time:\s*['"]([^'"]+)['"],\s*prepTime:\s*['"]([^'"]+)['"],\s*cookTime:\s*['"]([^'"]+)['"],\s*difficulty:\s*['"]([^'"]+)['"],\s*excerpt:\s*['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = recipeObjectRegex.exec(recipesContent)) !== null) {
    recipes.push({
      slug: match[1],
      title: match[2],
      category: match[3],
      time: match[4],
      prepTime: match[5],
      cookTime: match[6],
      difficulty: match[7],
      excerpt: match[8],
    });
  }
  
  return recipes;
}

/**
 * Parser opskrifter fra detail-siden ([slug]/page.tsx)
 */
function parseDetailRecipes(content) {
  const recipes = {};
  
  // Find recipes object - find start position
  const recipesStartMatch = content.match(/const recipes:\s*Record[^=]+=\s*\{/);
  if (!recipesStartMatch) {
    throw new Error('Kunne ikke finde recipes object i detail-siden');
  }
  
  const recipesStart = recipesStartMatch.index + recipesStartMatch[0].length;
  
  // Find end position - find matching closing brace
  const recipesEnd = findMatchingBracket(content, recipesStart - 1, '{', '}');
  if (recipesEnd === -1) {
    throw new Error('Kunne ikke finde slutning på recipes object');
  }
  
  const recipesContent = content.substring(recipesStart, recipesEnd);
  
  // Split på opskrifter - hver starter med 'slug': {
  const recipeBlocks = recipesContent.split(/(?=\s*['"][^'"]+['"]:\s*\{)/);
  
  for (const block of recipeBlocks) {
    if (!block.trim()) continue;
    
    const slugMatch = block.match(/['"]([^'"]+)['"]:\s*\{/);
    if (!slugMatch) continue;
    
    const slug = slugMatch[1];
    const recipeStart = slugMatch.index + slugMatch[0].length;
    
    // Find end of recipe object
    const recipeEnd = findMatchingBracket(block, recipeStart - 1, '{', '}');
    if (recipeEnd === -1) continue;
    
    const recipeContent = block.substring(recipeStart, recipeEnd);
    
    // Extract simple fields
    const idMatch = recipeContent.match(/id:\s*['"]([^'"]+)['"]/);
    const id = idMatch ? idMatch[1] : '';
    
    const titleMatch = recipeContent.match(/title:\s*['"]([^'"]+)['"]/);
    const title = titleMatch ? titleMatch[1] : '';
    
    const categoryMatch = recipeContent.match(/category:\s*['"]([^'"]+)['"]/);
    const category = categoryMatch ? categoryMatch[1] : '';
    
    const timeMatch = recipeContent.match(/time:\s*['"]([^'"]+)['"]/);
    const time = timeMatch ? timeMatch[1] : '';
    
    const prepTimeMatch = recipeContent.match(/prepTime:\s*['"]([^'"]+)['"]/);
    const prepTime = prepTimeMatch ? prepTimeMatch[1] : '';
    
    const cookTimeMatch = recipeContent.match(/cookTime:\s*['"]([^'"]+)['"]/);
    const cookTime = cookTimeMatch ? cookTimeMatch[1] : '';
    
    const difficultyMatch = recipeContent.match(/difficulty:\s*['"]([^'"]+)['"]/);
    const difficulty = difficultyMatch ? difficultyMatch[1] : '';
    
    // Extract description (kan være multi-line, men ser ud til at være single-line)
    const descMatch = recipeContent.match(/description:\s*['"]([^'"]+)['"]/);
    const description = descMatch ? descMatch[1] : '';
    
    // Extract ingredients array
    const ingredientsPos = recipeContent.indexOf('ingredients:');
    let ingredients = [];
    if (ingredientsPos !== -1) {
      const result = parseStringArray(recipeContent, ingredientsPos);
      ingredients = result.items;
    }
    
    // Extract instructions array
    const instructionsPos = recipeContent.indexOf('instructions:');
    let instructions = [];
    if (instructionsPos !== -1) {
      const result = parseStringArray(recipeContent, instructionsPos);
      instructions = result.items;
    }
    
    // Extract nutrition object
    const nutritionPos = recipeContent.indexOf('nutrition:');
    const nutrition = {
      energy: '',
      fat: '',
      saturatedFat: '',
      carbs: '',
      sugar: '',
      fiber: '',
      protein: '',
      salt: '',
    };
    
    if (nutritionPos !== -1) {
      const nutritionEnd = findMatchingBracket(recipeContent, nutritionPos + 'nutrition:'.length, '{', '}');
      if (nutritionEnd !== -1) {
        const nutritionContent = recipeContent.substring(nutritionPos, nutritionEnd + 1);
        
        const energyMatch = nutritionContent.match(/energy:\s*['"]([^'"]+)['"]/);
        if (energyMatch) nutrition.energy = energyMatch[1];
        
        const fatMatch = nutritionContent.match(/fat:\s*['"]([^'"]+)['"]/);
        if (fatMatch) nutrition.fat = fatMatch[1];
        
        const saturatedFatMatch = nutritionContent.match(/saturatedFat:\s*['"]([^'"]+)['"]/);
        if (saturatedFatMatch) nutrition.saturatedFat = saturatedFatMatch[1];
        
        const carbsMatch = nutritionContent.match(/carbs:\s*['"]([^'"]+)['"]/);
        if (carbsMatch) nutrition.carbs = carbsMatch[1];
        
        const sugarMatch = nutritionContent.match(/sugar:\s*['"]([^'"]+)['"]/);
        if (sugarMatch) nutrition.sugar = sugarMatch[1];
        
        const fiberMatch = nutritionContent.match(/fiber:\s*['"]([^'"]+)['"]/);
        if (fiberMatch) nutrition.fiber = fiberMatch[1];
        
        const proteinMatch = nutritionContent.match(/protein:\s*['"]([^'"]+)['"]/);
        if (proteinMatch) nutrition.protein = proteinMatch[1];
        
        const saltMatch = nutritionContent.match(/salt:\s*['"]([^'"]+)['"]/);
        if (saltMatch) nutrition.salt = saltMatch[1];
      }
    }
    
    recipes[slug] = {
      id,
      title,
      category,
      time,
      prepTime,
      cookTime,
      difficulty,
      description,
      ingredients,
      instructions,
      nutrition,
    };
  }
  
  return recipes;
}

/**
 * Kombinerer data fra begge kilder
 */
function combineRecipeData(listRecipes, detailRecipes) {
  const combined = [];
  const missing = [];
  const warnings = [];
  
  for (const listRecipe of listRecipes) {
    const slug = listRecipe.slug;
    const detailRecipe = detailRecipes[slug];
    
    if (!detailRecipe) {
      missing.push(slug);
      console.warn(`⚠️  Manglende detail data for: ${slug}`);
      continue;
    }
    
    // Kombiner data - brug detail data som primær kilde, men tag excerpt fra list
    const combinedRecipe = {
      slug: slug,
      id: detailRecipe.id || '',
      title: detailRecipe.title || listRecipe.title,
      category: detailRecipe.category || listRecipe.category,
      time: detailRecipe.time || listRecipe.time,
      prepTime: detailRecipe.prepTime || listRecipe.prepTime,
      cookTime: detailRecipe.cookTime || listRecipe.cookTime,
      difficulty: detailRecipe.difficulty || listRecipe.difficulty,
      excerpt: listRecipe.excerpt || detailRecipe.description?.substring(0, 200) || '',
      description: detailRecipe.description || '',
      ingredients: detailRecipe.ingredients || [],
      instructions: detailRecipe.instructions || [],
      nutrition: detailRecipe.nutrition || {
        energy: '',
        fat: '',
        saturatedFat: '',
        carbs: '',
        sugar: '',
        fiber: '',
        protein: '',
        salt: '',
      },
    };
    
    // Valider at alt data er til stede
    const missingFields = [];
    if (!combinedRecipe.id) missingFields.push('id');
    if (!combinedRecipe.title) missingFields.push('title');
    if (!combinedRecipe.description) missingFields.push('description');
    if (!combinedRecipe.ingredients || combinedRecipe.ingredients.length === 0) missingFields.push('ingredients');
    if (!combinedRecipe.instructions || combinedRecipe.instructions.length === 0) missingFields.push('instructions');
    if (!combinedRecipe.nutrition.energy) missingFields.push('nutrition.energy');
    if (!combinedRecipe.nutrition.fat) missingFields.push('nutrition.fat');
    if (!combinedRecipe.nutrition.saturatedFat) missingFields.push('nutrition.saturatedFat');
    if (!combinedRecipe.nutrition.carbs) missingFields.push('nutrition.carbs');
    if (!combinedRecipe.nutrition.sugar) missingFields.push('nutrition.sugar');
    if (!combinedRecipe.nutrition.fiber) missingFields.push('nutrition.fiber');
    if (!combinedRecipe.nutrition.protein) missingFields.push('nutrition.protein');
    if (!combinedRecipe.nutrition.salt) missingFields.push('nutrition.salt');
    
    if (missingFields.length > 0) {
      warnings.push({ slug, fields: missingFields });
      console.warn(`⚠️  ${slug}: Manglende felter: ${missingFields.join(', ')}`);
    }
    
    combined.push(combinedRecipe);
  }
  
  if (missing.length > 0) {
    console.error(`\n❌ ${missing.length} opskrifter mangler detail data!`);
  }
  
  if (warnings.length > 0) {
    console.warn(`\n⚠️  ${warnings.length} opskrifter har manglende felter`);
  }
  
  return combined;
}

/**
 * Hovedfunktion
 */
function main() {
  console.log('🚀 Starter ekstraktion af opskrifter...\n');
  
  try {
    // Læs filer
    console.log('📖 Læser filer...');
    const listContent = fs.readFileSync(LIST_PAGE, 'utf8');
    const detailContent = fs.readFileSync(DETAIL_PAGE, 'utf8');
    
    // Parse opskrifter
    console.log('🔍 Parser opskrifter fra liste-siden...');
    const listRecipes = parseListRecipes(listContent);
    console.log(`   ✅ Fundet ${listRecipes.length} opskrifter i liste`);
    
    console.log('🔍 Parser opskrifter fra detail-siden...');
    const detailRecipes = parseDetailRecipes(detailContent);
    console.log(`   ✅ Fundet ${Object.keys(detailRecipes).length} opskrifter i detail`);
    
    // Kombiner data
    console.log('\n🔗 Kombinerer data...');
    const combinedRecipes = combineRecipeData(listRecipes, detailRecipes);
    console.log(`   ✅ ${combinedRecipes.length} opskrifter kombineret`);
    
    // Gem individuelle JSON-filer
    console.log('\n💾 Gemmer JSON-filer...');
    const indexData = [];
    
    for (const recipe of combinedRecipes) {
      const filename = `${recipe.slug}.json`;
      const filepath = path.join(OUTPUT_DIR, filename);
      
      // Gem opskrift
      fs.writeFileSync(filepath, JSON.stringify(recipe, null, 2), 'utf8');
      
      // Tilføj til index (kun metadata)
      indexData.push({
        slug: recipe.slug,
        title: recipe.title,
        category: recipe.category,
        time: recipe.time,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
        excerpt: recipe.excerpt,
      });
      
      console.log(`   ✅ ${filename}`);
    }
    
    // Gem index.json
    const indexPath = path.join(OUTPUT_DIR, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
    console.log(`   ✅ index.json`);
    
    console.log(`\n✨ Færdig! ${combinedRecipes.length} opskrifter gemt i ${OUTPUT_DIR}`);
    console.log(`\n📊 Statistik:`);
    console.log(`   - Total opskrifter: ${combinedRecipes.length}`);
    console.log(`   - Med ingredienser: ${combinedRecipes.filter(r => r.ingredients.length > 0).length}`);
    console.log(`   - Med instruktioner: ${combinedRecipes.filter(r => r.instructions.length > 0).length}`);
    console.log(`   - Med næringsindhold: ${combinedRecipes.filter(r => r.nutrition.energy).length}`);
    
  } catch (error) {
    console.error('\n❌ Fejl:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Kør script
main();
