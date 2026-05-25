const RECIPE_DB = [
  {
    id: "scrambled-eggs",
    name: "Fluffy Scrambled Eggs",
    emoji: "🍳",
    time: "10 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Quick"],
    ingredients: [
      { name: "eggs", qty: "3" },
      { name: "milk", qty: "2 tbsp" },
      { name: "butter", qty: "1 tbsp" },
      { name: "salt", qty: "pinch" }
    ],
    instructions: [
      "Crack eggs into a bowl and whisk with milk and salt.",
      "Melt butter in a non-stick pan over medium-low heat.",
      "Pour in egg mixture and let it sit for a few seconds.",
      "Gently stir with a spatula until soft curds form.",
      "Remove from heat while still slightly glossy. Serve hot."
    ]
  },
  {
    id: "omelette",
    name: "Cheese & Spinach Omelette",
    emoji: "🧀",
    time: "12 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Vegetarian"],
    ingredients: [
      { name: "eggs", qty: "3" },
      { name: "spinach", qty: "1 cup" },
      { name: "cheese", qty: "1/4 cup" },
      { name: "butter", qty: "1 tbsp" },
      { name: "salt", qty: "pinch" },
      { name: "pepper", qty: "pinch" }
    ],
    instructions: [
      "Whisk eggs with salt and pepper.",
      "Saute spinach in butter for 1 minute.",
      "Pour eggs over spinach and cook for 2 minutes.",
      "Sprinkle cheese on one half, fold, and cook 1 more minute.",
      "Slide onto a plate and enjoy."
    ]
  },
  {
    id: "pancakes",
    name: "Classic Pancakes",
    emoji: "🥞",
    time: "20 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Sweet"],
    ingredients: [
      { name: "flour", qty: "1 cup" },
      { name: "milk", qty: "1 cup" },
      { name: "eggs", qty: "1" },
      { name: "sugar", qty: "1 tbsp" },
      { name: "baking powder", qty: "2 tsp" },
      { name: "butter", qty: "2 tbsp" },
      { name: "salt", qty: "pinch" }
    ],
    instructions: [
      "Mix dry ingredients (flour, sugar, baking powder, salt) in a bowl.",
      "Whisk milk, egg, and melted butter in another bowl.",
      "Combine wet and dry ingredients. Do not overmix.",
      "Cook on a buttered pan over medium heat until bubbles form.",
      "Flip and cook until golden brown. Serve warm."
    ]
  },
  {
    id: "grilled-cheese",
    name: "Grilled Cheese Sandwich",
    emoji: "🥪",
    time: "8 min",
    difficulty: "Easy",
    tags: ["Lunch", "Quick", "Comfort"],
    ingredients: [
      { name: "bread", qty: "2 slices" },
      { name: "cheese", qty: "2 slices" },
      { name: "butter", qty: "1 tbsp" }
    ],
    instructions: [
      "Butter one side of each bread slice.",
      "Place cheese between the unbuttered sides.",
      "Grill in a pan, buttered side down, on medium heat.",
      "Cook 3 minutes per side until golden and melty.",
      "Slice diagonally and serve."
    ]
  },
  {
    id: "pasta-aglio",
    name: "Pasta Aglio e Olio",
    emoji: "🍝",
    time: "15 min",
    difficulty: "Easy",
    tags: ["Dinner", "Italian", "Vegetarian"],
    ingredients: [
      { name: "pasta", qty: "200g" },
      { name: "garlic", qty: "4 cloves" },
      { name: "olive oil", qty: "1/4 cup" },
      { name: "red pepper flakes", qty: "1/2 tsp" },
      { name: "parsley", qty: "2 tbsp" },
      { name: "salt", qty: "to taste" }
    ],
    instructions: [
      "Boil pasta in salted water until al dente. Reserve 1/2 cup pasta water.",
      "Slice garlic thinly and saute in olive oil over medium heat until golden.",
      "Add red pepper flakes and pasta water. Simmer for 1 minute.",
      "Toss in drained pasta and mix well.",
      "Garnish with parsley and serve immediately."
    ]
  },
  {
    id: "tomato-pasta",
    name: "Creamy Tomato Pasta",
    emoji: "🍅",
    time: "20 min",
    difficulty: "Easy",
    tags: ["Dinner", "Comfort"],
    ingredients: [
      { name: "pasta", qty: "200g" },
      { name: "tomatoes", qty: "3" },
      { name: "garlic", qty: "2 cloves" },
      { name: "onion", qty: "1/2" },
      { name: "cream", qty: "1/2 cup" },
      { name: "olive oil", qty: "2 tbsp" },
      { name: "basil", qty: "handful" },
      { name: "salt", qty: "to taste" }
    ],
    instructions: [
      "Dice tomatoes, onion, and mince garlic.",
      "Saute onion and garlic in olive oil until soft.",
      "Add tomatoes and cook down for 8 minutes.",
      "Stir in cream and simmer for 3 minutes.",
      "Toss with cooked pasta and fresh basil."
    ]
  },
  {
    id: "fried-rice",
    name: "Quick Fried Rice",
    emoji: "🍚",
    time: "15 min",
    difficulty: "Easy",
    tags: ["Dinner", "Asian", "Leftover-friendly"],
    ingredients: [
      { name: "rice", qty: "2 cups cooked" },
      { name: "eggs", qty: "2" },
      { name: "carrots", qty: "1" },
      { name: "peas", qty: "1/2 cup" },
      { name: "soy sauce", qty: "2 tbsp" },
      { name: "garlic", qty: "2 cloves" },
      { name: "oil", qty: "2 tbsp" },
      { name: "green onions", qty: "2" }
    ],
    instructions: [
      "Scramble eggs in oil, then remove and set aside.",
      "Saute garlic, diced carrots, and peas for 3 minutes.",
      "Add cold cooked rice and break up clumps.",
      "Pour in soy sauce and stir-fry for 3 minutes.",
      "Mix in scrambled eggs and green onions. Serve hot."
    ]
  },
  {
    id: "chicken-stir-fry",
    name: "Chicken Stir Fry",
    emoji: "🥡",
    time: "20 min",
    difficulty: "Medium",
    tags: ["Dinner", "Asian", "Healthy"],
    ingredients: [
      { name: "chicken breast", qty: "2" },
      { name: "bell peppers", qty: "2" },
      { name: "broccoli", qty: "1 cup" },
      { name: "soy sauce", qty: "3 tbsp" },
      { name: "garlic", qty: "3 cloves" },
      { name: "ginger", qty: "1 tbsp" },
      { name: "oil", qty: "2 tbsp" },
      { name: "rice", qty: "for serving" }
    ],
    instructions: [
      "Slice chicken and vegetables into bite-sized pieces.",
      "Stir-fry chicken in hot oil for 5 minutes. Remove.",
      "Saute garlic, ginger, and vegetables for 4 minutes.",
      "Return chicken to pan, add soy sauce, toss for 2 minutes.",
      "Serve over steamed rice."
    ]
  },
  {
    id: "caprese-salad",
    name: "Caprese Salad",
    emoji: "🥗",
    time: "10 min",
    difficulty: "Easy",
    tags: ["Lunch", "Italian", "No-cook"],
    ingredients: [
      { name: "tomatoes", qty: "3" },
      { name: "mozzarella", qty: "200g" },
      { name: "basil", qty: "1 bunch" },
      { name: "olive oil", qty: "2 tbsp" },
      { name: "balsamic vinegar", qty: "1 tbsp" },
      { name: "salt", qty: "to taste" }
    ],
    instructions: [
      "Slice tomatoes and mozzarella into rounds.",
      "Arrange alternating slices on a plate.",
      "Tuck fresh basil leaves between slices.",
      "Drizzle with olive oil and balsamic vinegar.",
      "Sprinkle with salt and serve immediately."
    ]
  },
  {
    id: "spinach-salad",
    name: "Spinach & Egg Salad",
    emoji: "🥬",
    time: "12 min",
    difficulty: "Easy",
    tags: ["Lunch", "Healthy", "Quick"],
    ingredients: [
      { name: "spinach", qty: "3 cups" },
      { name: "eggs", qty: "2" },
      { name: "tomatoes", qty: "1" },
      { name: "olive oil", qty: "1 tbsp" },
      { name: "lemon juice", qty: "1 tbsp" },
      { name: "salt", qty: "pinch" }
    ],
    instructions: [
      "Hard-boil eggs for 10 minutes, then cool and slice.",
      "Wash spinach and tear into a bowl.",
      "Dice tomato and add to spinach.",
      "Top with sliced eggs.",
      "Drizzle with olive oil, lemon juice, and salt. Toss gently."
    ]
  },
  {
    id: "quesadilla",
    name: "Cheesy Quesadilla",
    emoji: "🌮",
    time: "10 min",
    difficulty: "Easy",
    tags: ["Lunch", "Mexican", "Quick"],
    ingredients: [
      { name: "tortillas", qty: "2" },
      { name: "cheese", qty: "1 cup shredded" },
      { name: "chicken breast", qty: "1/2 cup cooked" },
      { name: "salsa", qty: "2 tbsp" },
      { name: "butter", qty: "1 tsp" }
    ],
    instructions: [
      "Butter one side of each tortilla.",
      "Place cheese and chicken on the unbuttered side of one tortilla.",
      "Spread salsa on top, then cover with the second tortilla (buttered side up).",
      "Grill on a pan over medium heat for 3 minutes per side until crispy.",
      "Cut into wedges and serve with extra salsa."
    ]
  },
  {
    id: "banana-pancakes",
    name: "Banana Oat Pancakes",
    emoji: "🍌",
    time: "15 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Sweet", "Healthy"],
    ingredients: [
      { name: "bananas", qty: "2 ripe" },
      { name: "oats", qty: "1 cup" },
      { name: "eggs", qty: "2" },
      { name: "milk", qty: "1/4 cup" },
      { name: "cinnamon", qty: "1/2 tsp" },
      { name: "butter", qty: "for cooking" }
    ],
    instructions: [
      "Mash bananas in a bowl until smooth.",
      "Blend oats into flour using a blender.",
      "Mix banana, oat flour, eggs, milk, and cinnamon.",
      "Cook on a buttered pan like regular pancakes.",
      "Serve with sliced bananas or syrup."
    ]
  },
  {
    id: "french-toast",
    name: "Classic French Toast",
    emoji: "🍞",
    time: "12 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Sweet"],
    ingredients: [
      { name: "bread", qty: "4 slices" },
      { name: "eggs", qty: "2" },
      { name: "milk", qty: "1/2 cup" },
      { name: "cinnamon", qty: "1/2 tsp" },
      { name: "vanilla", qty: "1/2 tsp" },
      { name: "butter", qty: "2 tbsp" },
      { name: "sugar", qty: "1 tbsp" }
    ],
    instructions: [
      "Whisk eggs, milk, cinnamon, vanilla, and sugar.",
      "Dip each bread slice into the mixture for a few seconds.",
      "Melt butter in a pan over medium heat.",
      "Cook bread 2-3 minutes per side until golden.",
      "Serve with syrup or fresh fruit."
    ]
  },
  {
    id: "tomato-soup",
    name: "Creamy Tomato Soup",
    emoji: "🥣",
    time: "25 min",
    difficulty: "Easy",
    tags: ["Dinner", "Comfort", "Vegetarian"],
    ingredients: [
      { name: "tomatoes", qty: "6" },
      { name: "onion", qty: "1" },
      { name: "garlic", qty: "3 cloves" },
      { name: "vegetable broth", qty: "2 cups" },
      { name: "cream", qty: "1/2 cup" },
      { name: "butter", qty: "2 tbsp" },
      { name: "basil", qty: "handful" },
      { name: "salt", qty: "to taste" }
    ],
    instructions: [
      "Saute diced onion and garlic in butter until soft.",
      "Add chopped tomatoes and broth. Simmer 15 minutes.",
      "Blend until smooth using an immersion blender.",
      "Stir in cream and heat through without boiling.",
      "Garnish with basil and serve with crusty bread."
    ]
  },
  {
    id: "egg-fried-rice",
    name: "Egg Fried Rice",
    emoji: "🍳",
    time: "10 min",
    difficulty: "Easy",
    tags: ["Dinner", "Asian", "Leftover-friendly"],
    ingredients: [
      { name: "rice", qty: "1 cup cooked" },
      { name: "eggs", qty: "2" },
      { name: "soy sauce", qty: "1 tbsp" },
      { name: "green onions", qty: "1" },
      { name: "oil", qty: "1 tbsp" },
      { name: "salt", qty: "pinch" }
    ],
    instructions: [
      "Heat oil in a pan and scramble the eggs. Remove.",
      "Add rice and stir-fry for 2 minutes.",
      "Return eggs, add soy sauce and salt. Toss well.",
      "Top with sliced green onions.",
      "Serve hot as a quick meal."
    ]
  },
  {
    id: "cheese-omelette",
    name: "Three-Cheese Omelette",
    emoji: "🧀",
    time: "10 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Quick"],
    ingredients: [
      { name: "eggs", qty: "3" },
      { name: "cheese", qty: "1/2 cup mixed" },
      { name: "milk", qty: "2 tbsp" },
      { name: "butter", qty: "1 tbsp" },
      { name: "salt", qty: "pinch" }
    ],
    instructions: [
      "Whisk eggs with milk and salt.",
      "Melt butter in a pan over medium heat.",
      "Pour in eggs and let set for 1 minute.",
      "Sprinkle cheese on one half, fold over.",
      "Cook 1 more minute until cheese melts."
    ]
  },
  {
    id: "garlic-bread",
    name: "Garlic Bread",
    emoji: "🥖",
    time: "10 min",
    difficulty: "Easy",
    tags: ["Side", "Quick", "Comfort"],
    ingredients: [
      { name: "bread", qty: "1 baguette" },
      { name: "butter", qty: "4 tbsp" },
      { name: "garlic", qty: "4 cloves" },
      { name: "parsley", qty: "2 tbsp" },
      { name: "salt", qty: "pinch" }
    ],
    instructions: [
      "Mix softened butter with minced garlic, parsley, and salt.",
      "Slice bread but not all the way through.",
      "Spread garlic butter between slices and on top.",
      "Bake at 375°F (190°C) for 8 minutes until crispy.",
      "Serve warm with any meal."
    ]
  },
  {
    id: "smoothie",
    name: "Banana Spinach Smoothie",
    emoji: "🥤",
    time: "5 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Healthy", "No-cook"],
    ingredients: [
      { name: "bananas", qty: "1" },
      { name: "spinach", qty: "1 cup" },
      { name: "milk", qty: "1 cup" },
      { name: "yogurt", qty: "1/2 cup" },
      { name: "honey", qty: "1 tbsp" }
    ],
    instructions: [
      "Peel banana and break into chunks.",
      "Add all ingredients to a blender.",
      "Blend on high for 30 seconds until smooth.",
      "Pour into a glass and enjoy immediately.",
      "Optional: add ice for a thicker texture."
    ]
  },
  {
    id: "yogurt-parfait",
    name: "Yogurt Parfait",
    emoji: "🍨",
    time: "5 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Sweet", "No-cook"],
    ingredients: [
      { name: "yogurt", qty: "1 cup" },
      { name: "bananas", qty: "1" },
      { name: "oats", qty: "1/4 cup" },
      { name: "honey", qty: "1 tbsp" }
    ],
    instructions: [
      "Slice banana into rounds.",
      "Layer yogurt, oats, and bananas in a glass.",
      "Drizzle honey on top.",
      "Repeat layers if desired.",
      "Serve immediately or chill for 10 minutes."
    ]
  },
  {
    id: "chicken-pasta",
    name: "Chicken & Tomato Pasta",
    emoji: "🍗",
    time: "25 min",
    difficulty: "Medium",
    tags: ["Dinner", "Italian"],
    ingredients: [
      { name: "pasta", qty: "200g" },
      { name: "chicken breast", qty: "2" },
      { name: "tomatoes", qty: "4" },
      { name: "garlic", qty: "3 cloves" },
      { name: "onion", qty: "1" },
      { name: "olive oil", qty: "2 tbsp" },
      { name: "basil", qty: "handful" },
      { name: "salt", qty: "to taste" }
    ],
    instructions: [
      "Dice chicken and cook in olive oil until browned. Remove.",
      "Saute onion and garlic in the same pan.",
      "Add diced tomatoes and simmer 10 minutes.",
      "Return chicken to pan. Toss with cooked pasta.",
      "Garnish with fresh basil and serve."
    ]
  },
  {
    id: "beef-rice-bowl",
    name: "Beef & Rice Bowl",
    emoji: "🍚",
    time: "20 min",
    difficulty: "Easy",
    tags: ["Dinner", "Asian", "Quick"],
    ingredients: [
      { name: "ground beef", qty: "300g" },
      { name: "rice", qty: "2 cups cooked" },
      { name: "soy sauce", qty: "2 tbsp" },
      { name: "garlic", qty: "2 cloves" },
      { name: "ginger", qty: "1 tsp" },
      { name: "green onions", qty: "2" },
      { name: "oil", qty: "1 tbsp" }
    ],
    instructions: [
      "Cook rice according to package directions.",
      "Brown ground beef in a pan with oil.",
      "Add minced garlic, ginger, and soy sauce.",
      "Cook 3 more minutes until fragrant.",
      "Serve over rice topped with sliced green onions."
    ]
  },
  {
    id: "cheese-toast",
    name: "Cheesy Garlic Toast",
    emoji: "🧀",
    time: "8 min",
    difficulty: "Easy",
    tags: ["Snack", "Quick"],
    ingredients: [
      { name: "bread", qty: "2 slices" },
      { name: "cheese", qty: "1/2 cup" },
      { name: "butter", qty: "1 tbsp" },
      { name: "garlic", qty: "1 clove" }
    ],
    instructions: [
      "Mix softened butter with minced garlic.",
      "Spread on bread slices.",
      "Top generously with shredded cheese.",
      "Broil for 3-4 minutes until cheese is bubbly and golden.",
      "Serve hot as a snack or side."
    ]
  },
  {
    id: "veggie-stir-fry",
    name: "Veggie Stir Fry",
    emoji: "🥦",
    time: "15 min",
    difficulty: "Easy",
    tags: ["Dinner", "Healthy", "Vegetarian"],
    ingredients: [
      { name: "broccoli", qty: "1 cup" },
      { name: "carrots", qty: "2" },
      { name: "bell peppers", qty: "2" },
      { name: "garlic", qty: "3 cloves" },
      { name: "soy sauce", qty: "2 tbsp" },
      { name: "oil", qty: "2 tbsp" },
      { name: "rice", qty: "for serving" }
    ],
    instructions: [
      "Cut all vegetables into similar-sized pieces.",
      "Heat oil in a wok or large pan until smoking hot.",
      "Stir-fry vegetables for 5-6 minutes, keeping them crisp.",
      "Add garlic and soy sauce in the last minute.",
      "Serve immediately over steamed rice."
    ]
  },
  {
    id: "tomato-egg",
    name: "Chinese Tomato Egg Stir-fry",
    emoji: "🍅",
    time: "12 min",
    difficulty: "Easy",
    tags: ["Dinner", "Asian", "Quick"],
    ingredients: [
      { name: "eggs", qty: "3" },
      { name: "tomatoes", qty: "3" },
      { name: "sugar", qty: "1 tsp" },
      { name: "salt", qty: "1/2 tsp" },
      { name: "oil", qty: "2 tbsp" },
      { name: "green onions", qty: "1" }
    ],
    instructions: [
      "Scramble eggs and cook in oil. Remove and set aside.",
      "Cut tomatoes into wedges and cook in the same pan.",
      "Add sugar and salt. Cook 3 minutes until saucy.",
      "Return eggs to pan and gently fold together.",
      "Garnish with green onions. Serve with rice."
    ]
  },
  {
    id: "banana-bread",
    name: "Banana Bread",
    emoji: "🍞",
    time: "60 min",
    difficulty: "Easy",
    tags: ["Baking", "Sweet", "Snack"],
    ingredients: [
      { name: "bananas", qty: "3 ripe" },
      { name: "flour", qty: "1.5 cups" },
      { name: "sugar", qty: "3/4 cup" },
      { name: "eggs", qty: "2" },
      { name: "butter", qty: "1/3 cup" },
      { name: "baking soda", qty: "1 tsp" },
      { name: "vanilla", qty: "1 tsp" },
      { name: "salt", qty: "pinch" }
    ],
    instructions: [
      "Preheat oven to 350°F (175°C). Grease a loaf pan.",
      "Mash bananas and mix with melted butter.",
      "Beat in eggs, sugar, and vanilla.",
      "Fold in flour, baking soda, and salt.",
      "Pour into pan and bake 55-60 minutes until a toothpick comes out clean."
    ]
  },
  {
    id: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    emoji: "🍪",
    time: "25 min",
    difficulty: "Easy",
    tags: ["Baking", "Sweet", "Snack"],
    ingredients: [
      { name: "flour", qty: "2 cups" },
      { name: "butter", qty: "1 cup" },
      { name: "sugar", qty: "3/4 cup" },
      { name: "eggs", qty: "2" },
      { name: "vanilla", qty: "2 tsp" },
      { name: "baking soda", qty: "1 tsp" },
      { name: "salt", qty: "1 tsp" },
      { name: "chocolate chips", qty: "1 cup" }
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Cream butter and sugar until fluffy.",
      "Beat in eggs and vanilla.",
      "Mix in flour, baking soda, and salt.",
      "Fold in chocolate chips. Drop spoonfuls on a baking sheet.",
      "Bake 9-11 minutes until golden edges."
    ]
  },
  {
    id: "pancakes-simple",
    name: "2-Ingredient Pancakes",
    emoji: "🥞",
    time: "8 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Quick"],
    ingredients: [
      { name: "bananas", qty: "1 ripe" },
      { name: "eggs", qty: "2" }
    ],
    instructions: [
      "Mash banana in a bowl.",
      "Whisk in eggs until smooth.",
      "Cook spoonfuls on a buttered pan over medium heat.",
      "Flip when bubbles form on the surface.",
      "Serve with honey or fresh fruit."
    ]
  },
  {
    id: "spinach-pasta",
    name: "Creamy Spinach Pasta",
    emoji: "🍝",
    time: "18 min",
    difficulty: "Easy",
    tags: ["Dinner", "Vegetarian"],
    ingredients: [
      { name: "pasta", qty: "200g" },
      { name: "spinach", qty: "3 cups" },
      { name: "garlic", qty: "3 cloves" },
      { name: "cream", qty: "1/2 cup" },
      { name: "cheese", qty: "1/4 cup" },
      { name: "butter", qty: "2 tbsp" },
      { name: "salt", qty: "to taste" }
    ],
    instructions: [
      "Cook pasta until al dente. Reserve 1/2 cup pasta water.",
      "Melt butter and saute garlic for 30 seconds.",
      "Add spinach and cook until wilted.",
      "Pour in cream and cheese. Stir until melted.",
      "Toss with pasta and pasta water until creamy."
    ]
  },
  {
    id: "egg-salad",
    name: "Classic Egg Salad",
    emoji: "🥚",
    time: "15 min",
    difficulty: "Easy",
    tags: ["Lunch", "No-cook"],
    ingredients: [
      { name: "eggs", qty: "6" },
      { name: "mayonnaise", qty: "1/4 cup" },
      { name: "mustard", qty: "1 tsp" },
      { name: "salt", qty: "1/2 tsp" },
      { name: "pepper", qty: "1/4 tsp" },
      { name: "green onions", qty: "2" }
    ],
    instructions: [
      "Hard-boil eggs for 10 minutes, then cool.",
      "Peel and chop eggs into small pieces.",
      "Mix with mayonnaise, mustard, salt, and pepper.",
      "Fold in sliced green onions.",
      "Serve on bread or as a side."
    ]
  },
  {
    id: "rice-pudding",
    name: "Cinnamon Rice Pudding",
    emoji: "🍚",
    time: "30 min",
    difficulty: "Easy",
    tags: ["Dessert", "Sweet"],
    ingredients: [
      { name: "rice", qty: "1 cup cooked" },
      { name: "milk", qty: "2 cups" },
      { name: "sugar", qty: "1/4 cup" },
      { name: "cinnamon", qty: "1 tsp" },
      { name: "vanilla", qty: "1 tsp" }
    ],
    instructions: [
      "Combine cooked rice and milk in a saucepan.",
      "Simmer over medium heat, stirring often, for 20 minutes.",
      "Stir in sugar, cinnamon, and vanilla.",
      "Cook 5 more minutes until thick and creamy.",
      "Serve warm or chilled with a sprinkle of cinnamon."
    ]
  },
  {
    id: "cheeseburger",
    name: "Classic Cheeseburger",
    emoji: "🍔",
    time: "15 min",
    difficulty: "Easy",
    tags: ["Dinner", "American", "Quick"],
    ingredients: [
      { name: "ground beef", qty: "300g" },
      { name: "cheese", qty: "4 slices" },
      { name: "bread", qty: "4 slices" },
      { name: "tomatoes", qty: "1" },
      { name: "lettuce", qty: "4 leaves" },
      { name: "onion", qty: "1/2" },
      { name: "salt", qty: "1 tsp" },
      { name: "pepper", qty: "1/2 tsp" }
    ],
    instructions: [
      "Form beef into 4 patties. Season with salt and pepper.",
      "Grill or pan-fry patties over medium-high heat for 4 minutes per side.",
      "Add cheese in the last minute to melt.",
      "Assemble burgers with tomato, lettuce, and onion on bread.",
      "Serve immediately with your favorite condiments."
    ]
  },
  {
    id: "beef-tacos",
    name: "Beef Tacos",
    emoji: "🌮",
    time: "20 min",
    difficulty: "Easy",
    tags: ["Dinner", "Mexican", "Quick"],
    ingredients: [
      { name: "ground beef", qty: "300g" },
      { name: "tortillas", qty: "8" },
      { name: "tomatoes", qty: "2" },
      { name: "cheese", qty: "1 cup shredded" },
      { name: "onion", qty: "1/2" },
      { name: "lettuce", qty: "1 cup shredded" },
      { name: "salsa", qty: "1/2 cup" },
      { name: "cumin", qty: "1 tsp" },
      { name: "salt", qty: "1 tsp" }
    ],
    instructions: [
      "Brown ground beef in a pan, breaking it up as it cooks.",
      "Season with cumin and salt.",
      "Warm tortillas in a dry pan for 30 seconds per side.",
      "Dice tomatoes and onion. Shred lettuce.",
      "Assemble tacos with beef, cheese, veggies, and salsa."
    ]
  },
  {
    id: "chicken-salad",
    name: "Chicken Salad",
    emoji: "🥗",
    time: "10 min",
    difficulty: "Easy",
    tags: ["Lunch", "Healthy", "No-cook"],
    ingredients: [
      { name: "chicken breast", qty: "2 cups cooked" },
      { name: "mayonnaise", qty: "1/3 cup" },
      { name: "celery", qty: "2 stalks" },
      { name: "onion", qty: "1/4" },
      { name: "salt", qty: "1/2 tsp" },
      { name: "pepper", qty: "1/4 tsp" },
      { name: "lemon juice", qty: "1 tbsp" }
    ],
    instructions: [
      "Dice cooked chicken into small cubes.",
      "Finely chop celery and onion.",
      "Mix chicken, celery, onion, and mayonnaise.",
      "Season with salt, pepper, and lemon juice.",
      "Chill for 30 minutes before serving on bread or greens."
    ]
  },
  {
    id: "creamy-mushroom-pasta",
    name: "Creamy Mushroom Pasta",
    emoji: "🍝",
    time: "22 min",
    difficulty: "Easy",
    tags: ["Dinner", "Vegetarian", "Comfort"],
    ingredients: [
      { name: "pasta", qty: "200g" },
      { name: "mushrooms", qty: "2 cups sliced" },
      { name: "garlic", qty: "3 cloves" },
      { name: "butter", qty: "3 tbsp" },
      { name: "cream", qty: "1/2 cup" },
      { name: "cheese", qty: "1/4 cup" },
      { name: "parsley", qty: "2 tbsp" },
      { name: "salt", qty: "to taste" }
    ],
    instructions: [
      "Cook pasta until al dente. Reserve pasta water.",
      "Saute mushrooms in butter until golden, about 6 minutes.",
      "Add garlic and cook 1 minute.",
      "Pour in cream and cheese. Stir until smooth.",
      "Toss with pasta and parsley. Add pasta water if needed."
    ]
  },
  {
    id: "apple-oatmeal",
    name: "Apple Cinnamon Oatmeal",
    emoji: "🍎",
    time: "10 min",
    difficulty: "Easy",
    tags: ["Breakfast", "Healthy", "Quick"],
    ingredients: [
      { name: "oats", qty: "1/2 cup" },
      { name: "milk", qty: "1 cup" },
      { name: "apple", qty: "1" },
      { name: "cinnamon", qty: "1/2 tsp" },
      { name: "honey", qty: "1 tbsp" },
      { name: "butter", qty: "1 tsp" }
    ],
    instructions: [
      "Dice apple into small cubes.",
      "Bring milk and oats to a gentle simmer.",
      "Add apple and cinnamon. Cook 5 minutes, stirring.",
      "Remove from heat and stir in butter and honey.",
      "Serve warm with extra cinnamon on top."
    ]
  },
  {
    id: "garlic-shrimp-pasta",
    name: "Garlic Shrimp Pasta",
    emoji: "🍤",
    time: "18 min",
    difficulty: "Medium",
    tags: ["Dinner", "Italian", "Quick"],
    ingredients: [
      { name: "pasta", qty: "200g" },
      { name: "shrimp", qty: "300g" },
      { name: "garlic", qty: "5 cloves" },
      { name: "butter", qty: "3 tbsp" },
      { name: "lemon juice", qty: "1 tbsp" },
      { name: "parsley", qty: "3 tbsp" },
      { name: "red pepper flakes", qty: "1/2 tsp" },
      { name: "salt", qty: "to taste" }
    ],
    instructions: [
      "Cook pasta until al dente. Reserve pasta water.",
      "Melt butter and saute garlic for 30 seconds.",
      "Add shrimp and cook 2-3 minutes per side until pink.",
      "Toss in pasta, lemon juice, parsley, and red pepper.",
      "Add a splash of pasta water if needed. Serve hot."
    ]
  },
  {
    id: "potato-salad",
    name: "Classic Potato Salad",
    emoji: "🥔",
    time: "30 min",
    difficulty: "Easy",
    tags: ["Side", "American"],
    ingredients: [
      { name: "potatoes", qty: "4" },
      { name: "eggs", qty: "3" },
      { name: "mayonnaise", qty: "1/2 cup" },
      { name: "mustard", qty: "1 tbsp" },
      { name: "celery", qty: "2 stalks" },
      { name: "onion", qty: "1/4" },
      { name: "salt", qty: "1 tsp" },
      { name: "pepper", qty: "1/2 tsp" }
    ],
    instructions: [
      "Boil potatoes until tender, about 15 minutes. Cool and cube.",
      "Hard-boil eggs, cool, peel, and chop.",
      "Dice celery and onion.",
      "Mix all ingredients with mayonnaise and mustard.",
      "Season with salt and pepper. Chill before serving."
    ]
  }
];
