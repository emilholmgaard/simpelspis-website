import fs from 'fs';
import path from 'path';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  time: string;
  difficulty: string;
  category: string;
  servings: string;
  tags?: string[];
  ingredients: string[];
  steps: Array<{
    title: string;
    text: string;
  }>;
  nutrition?: {
    calories?: string;
    fiber?: string;
    protein?: string;
    carbs?: string;
    fats?: string;
    sugar?: string;
  };
}

const recipesDirectory = path.join(process.cwd(), 'data', 'opskrifter');

export function getAllRecipes(): Recipe[] {
  try {
    const fileNames = fs.readdirSync(recipesDirectory);
    const recipes = fileNames
      .filter((fileName) => fileName.endsWith('.json'))
      .map((fileName) => {
        const filePath = path.join(recipesDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents) as Recipe;
      });
    
    // Sort by ID
    return recipes.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  } catch (error) {
    console.error('Error reading recipes:', error);
    return [];
  }
}

export function getRecipeById(id: string): Recipe | null {
  try {
    const filePath = path.join(recipesDirectory, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Recipe;
  } catch (error) {
    console.error('Error reading recipe:', error);
    return null;
  }
}

