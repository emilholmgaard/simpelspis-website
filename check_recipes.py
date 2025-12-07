
import os
import re
import json

def slugify(text):
    text = text.lower()
    text = text.replace('æ', 'ae')
    text = text.replace('ø', 'oe')
    text = text.replace('å', 'aa')
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    return text

def check_recipes():
    # Read ALLE_OPSKRIFTER.md
    with open('ALLE_OPSKRIFTER.md', 'r') as f:
        content = f.read()

    # Extract recipes
    recipes = []
    for line in content.split('\n'):
        match = re.match(r'^\d+\.\s+(.+)$', line.strip())
        if match:
            recipes.append(match.group(1).strip())

    print(f"Found {len(recipes)} recipes in ALLE_OPSKRIFTER.md")

    existing_files = set(os.listdir('src/data/recipes'))
    
    missing_recipes = []
    
    for recipe_name in recipes:
        slug = slugify(recipe_name)
        filename = f"{slug}.json"
        
        if filename not in existing_files:
            missing_recipes.append((recipe_name, slug))
            
    print(f"Found {len(missing_recipes)} missing recipes:")
    for name, slug in missing_recipes:
        print(f"- {name} ({slug})")
        
    return missing_recipes

if __name__ == "__main__":
    check_recipes()
