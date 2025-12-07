
import os
import re
import json
import sys

# Add project root to path if needed, but we are running relative to it
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def slugify(text):
    text = text.lower()
    text = text.replace('æ', 'ae')
    text = text.replace('ø', 'oe')
    text = text.replace('å', 'aa')
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    return text

def check_recipes():
    md_path = os.path.join(project_root, 'ALLE_OPSKRIFTER.md')
    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found")
        return

    # Read ALLE_OPSKRIFTER.md
    with open(md_path, 'r') as f:
        content = f.read()

    # Extract recipes
    recipes = []
    for line in content.split('\n'):
        match = re.match(r'^\d+\.\s+(.+)$', line.strip())
        if match:
            recipes.append(match.group(1).strip())

    print(f"Found {len(recipes)} recipes in ALLE_OPSKRIFTER.md")

    recipes_dir = os.path.join(project_root, 'src/data/recipes')
    existing_files = set(os.listdir(recipes_dir))
    
    missing_recipes = []
    
    for recipe_name in recipes:
        slug = slugify(recipe_name)
        filename = f"{slug}.json"
        
        if filename not in existing_files:
            missing_recipes.append((recipe_name, slug))
            
    print(f"Found {len(missing_recipes)} missing recipes:")
    for name, slug in missing_recipes:
        print(f"- {name} ({slug})")

if __name__ == "__main__":
    check_recipes()
