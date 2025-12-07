#!/usr/bin/env node

/**
 * Script til at tilføje datePublished og dateModified til alle opskrifter
 * Dato: 7. december 2025
 */

const fs = require('fs');
const path = require('path');

const recipesDir = path.join(__dirname, '../src/data/recipes');
const datePublished = '2025-12-07T10:00:00+01:00';
const dateModified = new Date().toISOString();

// Læs alle filer i recipes mappen
const files = fs.readdirSync(recipesDir);

let updated = 0;
let skipped = 0;

files.forEach(file => {
  // Skip index.json
  if (file === 'index.json') {
    return;
  }

  // Kun JSON filer
  if (!file.endsWith('.json')) {
    return;
  }

  const filePath = path.join(recipesDir, file);
  
  try {
    // Læs opskriften
    const content = fs.readFileSync(filePath, 'utf8');
    const recipe = JSON.parse(content);

  // Tjek om datePublished allerede findes
  if (recipe.datePublished) {
    console.log(`⏭️  ${file} - datePublished findes allerede: ${recipe.datePublished}`);
    skipped++;
    return;
  }

  // Tilføj datePublished og dateModified
  recipe.datePublished = datePublished;
  recipe.dateModified = dateModified;

  // Gem filen med korrekt formatering (2 spaces indentation)
  fs.writeFileSync(filePath, JSON.stringify(recipe, null, 2) + '\n', 'utf8');
  
  console.log(`✅ ${file} - Tilføjet datePublished: ${datePublished}`);
  updated++;
  } catch (error) {
    console.error(`❌ Fejl ved behandling af ${file}:`, error.message);
  }
});

console.log(`\n📊 Resultat:`);
console.log(`   ✅ Opdateret: ${updated} opskrifter`);
console.log(`   ⏭️  Sprunget over: ${skipped} opskrifter`);
console.log(`   📅 Dato: ${datePublished}`);
