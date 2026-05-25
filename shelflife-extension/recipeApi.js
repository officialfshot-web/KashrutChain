// TheMealDB integration — free, no API key required
// https://www.themealdb.com/api.php

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

// Cache in memory for the session
let apiCache = {};

// Load cache from chrome.storage on init
chrome.storage?.local.get(['sl_recipe_cache'], (res) => {
  if (res.sl_recipe_cache) apiCache = res.sl_recipe_cache;
});

function saveCache() {
  chrome.storage?.local.set({ sl_recipe_cache: apiCache });
}

// Normalize ingredient names for matching
function normalize(str) {
  return str.toLowerCase().replace(/[^a-z]/g, '');
}

// Check if two ingredient names match (fuzzy)
function ingredientMatches(haveName, recipeIngredient) {
  const a = normalize(haveName);
  const b = normalize(recipeIngredient);
  if (a === b) return true;
  if (b.includes(a) || a.includes(b)) return true;
  // Common aliases
  const aliases = {
    'chickenbreast': ['chicken', 'chickenbreast'],
    'groundbeef': ['beef', 'mincedbeef', 'groundbeef'],
    'eggs': ['egg'],
    'tomatoes': ['tomato'],
    'bananas': ['banana'],
    'onion': ['onions'],
    'garlic': ['garlicclove', 'garliccloves'],
    'cheese': ['cheddar', 'mozzarella', 'parmesan', 'cheese'],
    'bread': ['slicedbread', 'baguette'],
    'milk': ['wholemilk', 'skimmilk'],
    'rice': ['whiterice', 'cookedrice'],
    'pasta': ['spaghetti', 'penne', 'fettuccine', 'macaroni'],
    'bellpeppers': ['pepper', 'capsicum', 'greenpepper'],
    'yogurt': ['greekyogurt', 'plainyogurt'],
    'spinach': ['babyspinach'],
    'carrots': ['carrot'],
    'potatoes': ['potato'],
    'mushrooms': ['mushroom'],
    'shrimp': ['prawns', 'prawn'],
    'lettuce': ['romaine', 'iceberg'],
    'celery': ['celerystalk'],
    'oliveoil': ['oil', 'extravirginoliveoil'],
    'flour': ['allpurposeflour'],
    'sugar': ['whitesugar', 'brownsugar'],
    'butter': ['unsaltedbutter'],
    'cream': ['heavy cream', 'whippingcream', 'doublecream'],
    'soysauce': ['soya sauce', 'soysauce'],
    'greenonions': ['scallions', 'springonions'],
    'chocolatechips': ['chocolate'],
    'salsa': ['tomatosalsa'],
    'tortillas': ['flourtortillas', 'corntortillas'],
    'bakingpowder': ['bakingpowder'],
    'bakingsoda': ['bakingsoda'],
    'vanilla': ['vanillaextract'],
    'cinnamon': ['groundcinnamon'],
    'ginger': ['groundginger', 'freshginger'],
    'basil': ['freshbasil'],
    'parsley': ['freshparsley'],
    'lemonjuice': ['lemon'],
    'balsamicvinegar': ['balsamic'],
    'redpepperflakes': ['chiliflakes', 'redchili'],
    'mustard': ['dijonmustard', 'yellowmustard'],
    'mayonnaise': ['mayo'],
    'honey': ['rawhoney'],
    'cumin': ['groundcumin'],
    'apple': ['apples'],
    'broccoli': ['broccoliflorets'],
    'peas': ['greenpeas', 'frozenpeas'],
    'oats': ['rolledoats', 'quakeroats'],
    'corn': ['sweetcorn', 'cornkernels'],
  };
  for (const [key, vals] of Object.entries(aliases)) {
    const all = [key, ...vals];
    if (all.includes(a) && all.includes(b)) return true;
    if (all.includes(a) && b.includes(key)) return true;
    if (all.includes(b) && a.includes(key)) return true;
  }
  return false;
}

// Fetch meals by a single ingredient
async function fetchByIngredient(ingredient) {
  const cacheKey = 'ing_' + normalize(ingredient);
  if (apiCache[cacheKey]) return apiCache[cacheKey];

  try {
    const res = await fetch(`${MEALDB_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await res.json();
    const meals = data.meals || [];
    apiCache[cacheKey] = meals;
    saveCache();
    return meals;
  } catch (e) {
    return [];
  }
}

// Fetch full meal details by ID
async function fetchMealDetails(id) {
  const cacheKey = 'meal_' + id;
  if (apiCache[cacheKey]) return apiCache[cacheKey];

  try {
    const res = await fetch(`${MEALDB_BASE}/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals?.[0] || null;
    if (meal) {
      apiCache[cacheKey] = meal;
      saveCache();
    }
    return meal;
  } catch (e) {
    return null;
  }
}

// Convert TheMealDB meal to our internal recipe format
function convertMeal(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal['strIngredient' + i];
    const measure = meal['strMeasure' + i];
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim().toLowerCase(),
        qty: (measure || 'some').trim()
      });
    }
  }

  // Parse instructions into steps
  const instructions = (meal.strInstructions || '')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && !s.match(/^(step|\d+\.|\$)/i))
    .slice(0, 8);

  // If no good steps, split by sentences
  const steps = instructions.length > 0 ? instructions :
    (meal.strInstructions || '').match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()).slice(0, 8) || ['Follow the recipe instructions.'];

  return {
    id: 'mdb_' + meal.idMeal,
    name: meal.strMeal,
    emoji: getEmojiForCategory(meal.strCategory),
    time: '30 min',
    difficulty: 'Medium',
    tags: [meal.strCategory, meal.strArea].filter(Boolean),
    ingredients: ingredients,
    instructions: steps,
    image: meal.strMealThumb,
    source: 'TheMealDB'
  };
}

function getEmojiForCategory(cat) {
  const map = {
    'Beef': '🥩', 'Chicken': '🍗', 'Dessert': '🍰', 'Lamb': '🍖',
    'Pasta': '🍝', 'Pork': '🥓', 'Seafood': '🍤', 'Side': '🥗',
    'Starter': '🥣', 'Vegan': '🌱', 'Vegetarian': '🥬',
    'Breakfast': '🍳', 'Goat': '🐐', 'Soup': '🍲', 'Miscellaneous': '🍽️'
  };
  return map[cat] || '🍽️';
}

// Main function: get recipes based on inventory items
async function getApiRecipes(inventoryItems, maxResults = 20) {
  if (!inventoryItems || inventoryItems.length === 0) return [];

  // Sort by expiry urgency so we search with expiring items first
  const sorted = [...inventoryItems].sort((a, b) => {
    const da = new Date(a.expiry) - new Date();
    const db = new Date(b.expiry) - new Date();
    return da - db;
  });

  // Search TheMealDB with top 4 items
  const searchItems = sorted.slice(0, 4);
  const allMealIds = new Set();
  const idToSourceIngredient = {};

  for (const item of searchItems) {
    const meals = await fetchByIngredient(item.name);
    for (const m of meals) {
      allMealIds.add(m.idMeal);
      if (!idToSourceIngredient[m.idMeal]) {
        idToSourceIngredient[m.idMeal] = item.name;
      }
    }
  }

  // Fetch details for all unique meals (limit to avoid rate limits)
  const ids = Array.from(allMealIds).slice(0, maxResults);
  const detailPromises = ids.map(id => fetchMealDetails(id));
  const details = await Promise.all(detailPromises);

  const recipes = details
    .filter(m => m)
    .map(convertMeal)
    .map(r => {
      // Score based on how many inventory items match
      const haveNames = inventoryItems.map(i => i.name.toLowerCase());
      let matchCount = 0;
      let expiringMatches = 0;
      for (const ing of r.ingredients) {
        for (const have of inventoryItems) {
          if (ingredientMatches(have.name, ing.name)) {
            matchCount++;
            const daysLeft = Math.ceil((new Date(have.expiry) - new Date()) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 5) expiringMatches++;
            break;
          }
        }
      }
      const totalIngs = r.ingredients.length || 1;
      const score = (matchCount / totalIngs) * 100;
      return {
        ...r,
        matchScore: Math.round(score),
        matchedIngredients: matchCount,
        totalIngredients: totalIngs,
        expiringMatches: expiringMatches,
        priorityIngredient: idToSourceIngredient[r.id.replace('mdb_', '')]
      };
    });

  // Sort: expiring matches first, then score, then matched count
  recipes.sort((a, b) => {
    if (b.expiringMatches !== a.expiringMatches) return b.expiringMatches - a.expiringMatches;
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return b.matchedIngredients - a.matchedIngredients;
  });

  return recipes;
}

// Merge API recipes with local recipes, deduplicate by name
function mergeRecipes(apiRecipes, localRecipes) {
  const seen = new Set();
  const merged = [];

  for (const r of [...apiRecipes, ...localRecipes]) {
    const key = normalize(r.name);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(r);
    }
  }
  return merged;
}

// Expose to popup.js
window.RecipeAPI = {
  getRecipes: getApiRecipes,
  mergeRecipes: mergeRecipes,
  ingredientMatches: ingredientMatches
};
