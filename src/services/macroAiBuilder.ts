import { FoodItem, MacroGoalRequest, MacroMealResponse } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import sizzleNutritionalDb from '../data/sizzleNutritionalDatabase.json';

const NUTRITION_MAP: Record<string, { id: number; name: string; calories: number; protein: number; carbs: number; fat: number }> = sizzleNutritionalDb;

export function getItemMacros(item: FoodItem) {
  // 1. Direct JSON Lookup by item.id
  if (item && item.id && NUTRITION_MAP[String(item.id)]) {
    const entry = NUTRITION_MAP[String(item.id)];
    return {
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
    };
  }

  // 2. Direct JSON Lookup by exact item.name
  if (item && item.name) {
    const matched = Object.values(NUTRITION_MAP).find(
      (entry) => entry.name.toLowerCase() === item.name.toLowerCase()
    );
    if (matched) {
      return {
        calories: matched.calories,
        protein: matched.protein,
        carbs: matched.carbs,
        fat: matched.fat,
      };
    }
  }

  // 3. Fallback to existing item properties if valid
  if (item && item.calories && item.calories > 0 && item.protein && item.protein > 0) {
    return {
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs || 30,
      fat: item.fat || 15,
    };
  }

  return { calories: 380, protein: 14, carbs: 46, fat: 16 };
}

export function buildMacroMeal(request: MacroGoalRequest, menuItemsList: FoodItem[] = MENU_ITEMS): MacroMealResponse {
  const { targetCalories, minProtein, dietaryFilter, preset = 'BALANCED' } = request;

  // Solution 1: Always enforce full 52-item menu list so AI evaluates all 11 categories
  const sourceList = (menuItemsList && menuItemsList.length >= 20) ? menuItemsList : MENU_ITEMS;

  // Filter items by dietary preference
  let validItems = sourceList.filter((item) => {
    if (dietaryFilter === 'Veg' && !item.isVeg) return false;
    if (dietaryFilter === 'Non-Veg' && item.isVeg) return false;
    return true;
  });

  if (validItems.length === 0) {
    validItems = sourceList;
  }

  // Solution 2: Hard Bounded Boundaries
  const maxAllowedCalories = preset === 'LOW_CALORIE' 
    ? Math.min(targetCalories + 30, targetCalories * 1.08) 
    : Math.max(targetCalories + 50, targetCalories * 1.10);
  const minAllowedCalories = Math.max(200, targetCalories * 0.65);
  const maxKetoCarbs = 22; // Hard cap for Keto mode

  interface CandidateMeal {
    items: { foodItem: FoodItem; quantity: number }[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalPrice: number;
    score: number;
    categoryGroup: string;
  }

  const candidateMeals: CandidateMeal[] = [];

  const getCategoryGroup = (item: FoodItem): string => {
    const cat = (item.category || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    if (cat.includes('grill') || cat.includes('tandoor') || name.includes('kebab') || name.includes('tikka') || name.includes('grill')) {
      return 'GRILL_TANDOOR';
    }
    if (cat.includes('biryani') || cat.includes('curry') || cat.includes('bread') || name.includes('biryani') || name.includes('masala')) {
      return 'BIRYANI_CURRY';
    }
    if (cat.includes('starter') || cat.includes('snack') || cat.includes('beverage') || cat.includes('dessert') || name.includes('wings') || name.includes('fries') || name.includes('soda')) {
      return 'STARTERS_BEVERAGES';
    }
    return 'MAINS_FASTFOOD';
  };

  // 1. Evaluate single items
  validItems.forEach((item) => {
    const macros = getItemMacros(item);
    const calories = macros.calories;
    const protein = macros.protein;
    const carbs = macros.carbs;
    const fat = macros.fat;

    // Hard boundary filtering
    if (calories > maxAllowedCalories || calories < minAllowedCalories) return;
    if (preset === 'KETO' && carbs > maxKetoCarbs) return;

    const calDiff = Math.abs(calories - targetCalories);
    const protDiff = Math.max(0, minProtein - protein);

    let bonus = 0;
    const catGrp = getCategoryGroup(item);

    if (preset === 'HIGH_PROTEIN') {
      bonus += protein * 3.0; // High protein bonus
      if (catGrp === 'GRILL_TANDOOR') bonus += 45; // Category boost for lean grills
    }
    if (preset === 'KETO' && carbs <= 15) bonus += 50;
    if (preset === 'LOW_CALORIE' && calories <= targetCalories) bonus += 40;

    const score = 100 - (calDiff * 0.12) - (protDiff * 1.5) + bonus;
    candidateMeals.push({
      items: [{ foodItem: { ...item, ...macros }, quantity: 1 }],
      totalCalories: calories,
      totalProtein: protein,
      totalCarbs: carbs,
      totalFat: fat,
      totalPrice: item.price,
      score: Math.max(45, Math.min(99, Math.round(score))),
      categoryGroup: catGrp,
    });
  });

  // 2. Evaluate 2-item meal combinations
  const mains = validItems.filter((i) => i.category !== 'Beverage' && i.category !== 'Breads');
  const sides = validItems.filter((i) => i.category === 'Breads' || i.category === 'Beverage' || i.category === 'Starters');

  for (const rawMain of mains) {
    const mainMacros = getItemMacros(rawMain);
    const mainItem = { ...rawMain, ...mainMacros };

    for (const rawSide of sides.length > 0 ? sides : validItems) {
      if (rawMain.id === rawSide.id) continue;
      const sideMacros = getItemMacros(rawSide);
      const sideItem = { ...rawSide, ...sideMacros };

      const calories = mainItem.calories + sideItem.calories;
      const protein = mainItem.protein + sideItem.protein;
      const carbs = mainItem.carbs + sideItem.carbs;
      const fat = mainItem.fat + sideItem.fat;

      // Hard boundary filtering
      if (calories > maxAllowedCalories || calories < minAllowedCalories) continue;
      if (preset === 'KETO' && carbs > maxKetoCarbs) continue;

      const calDiff = Math.abs(calories - targetCalories);
      const protDiff = Math.max(0, minProtein - protein);

      let presetBonus = 0;
      const catGrp = getCategoryGroup(mainItem);

      if (preset === 'HIGH_PROTEIN') {
        presetBonus += protein * 2.8;
        if (catGrp === 'GRILL_TANDOOR') presetBonus += 35;
      }
      if (preset === 'KETO' && carbs <= 15) presetBonus += 45;
      if (preset === 'LOW_CALORIE' && calories <= targetCalories) presetBonus += 35;

      const rawScore = 100 - (calDiff * 0.10) - (protDiff * 1.3) + presetBonus;
      const score = Math.max(45, Math.min(99, Math.round(rawScore)));

      candidateMeals.push({
        items: [
          { foodItem: mainItem, quantity: 1 },
          { foodItem: sideItem, quantity: 1 },
        ],
        totalCalories: calories,
        totalProtein: protein,
        totalCarbs: carbs,
        totalFat: fat,
        totalPrice: mainItem.price + sideItem.price,
        score,
        categoryGroup: catGrp,
      });
    }
  }

  // Sort candidates by match score descending
  candidateMeals.sort((a, b) => b.score - a.score);

  // Solution 3: Category Diversity Enforcement for Option 1, Option 2, Option 3
  const distinctCombos: CandidateMeal[] = [];
  const usedCategoryGroups = new Set<string>();
  const seenDishKeys = new Set<string>();

  // Pass 1: Try picking 1 top meal from distinct category groups
  for (const candidate of candidateMeals) {
    const dishKey = candidate.items.map((i) => i.foodItem.id).sort().join('-');
    if (seenDishKeys.has(dishKey)) continue;

    if (!usedCategoryGroups.has(candidate.categoryGroup)) {
      usedCategoryGroups.add(candidate.categoryGroup);
      seenDishKeys.add(dishKey);
      distinctCombos.push(candidate);
    }
    if (distinctCombos.length >= 3) break;
  }

  // Pass 2: Fill remaining slots if any category group was empty
  if (distinctCombos.length < 3) {
    for (const candidate of candidateMeals) {
      const dishKey = candidate.items.map((i) => i.foodItem.id).sort().join('-');
      if (!seenDishKeys.has(dishKey)) {
        seenDishKeys.add(dishKey);
        distinctCombos.push(candidate);
      }
      if (distinctCombos.length >= 3) break;
    }
  }

  // Fallback candidate if no valid candidates met hard constraints
  if (distinctCombos.length === 0) {
    const fallbackItem = validItems[0] || sourceList[0];
    const fallbackMacros = getItemMacros(fallbackItem);
    distinctCombos.push({
      items: [{ foodItem: { ...fallbackItem, ...fallbackMacros }, quantity: 1 }],
      totalCalories: fallbackMacros.calories,
      totalProtein: fallbackMacros.protein,
      totalCarbs: fallbackMacros.carbs,
      totalFat: fallbackMacros.fat,
      totalPrice: fallbackItem.price,
      score: 85,
      categoryGroup: 'GRILL_TANDOOR',
    });
  }

  const badges = ['🥇 AI Chef Choice', '🥈 High Protein Alternative', '🥉 Balanced Gourmet Combo'];

  const topCombos = distinctCombos.map((c, idx) => {
    let expl = '';
    if (preset === 'HIGH_PROTEIN') {
      expl = `Delivers ${c.totalProtein}g protein (${c.totalCalories} kcal) targeting maximum muscle recovery.`;
    } else if (preset === 'KETO') {
      expl = `Ultra low-carb ketogenic combination with ${c.totalFat}g healthy fats and only ${c.totalCarbs}g net carbs.`;
    } else if (preset === 'LOW_CALORIE') {
      expl = `Light calorie-conscious combo with ${c.totalCalories} kcal and ${c.totalProtein}g protein.`;
    } else {
      expl = `Balanced nutritional ratio offering ${c.totalCalories} kcal, ${c.totalProtein}g protein, and ${c.totalCarbs}g carbs.`;
    }

    return {
      id: `combo-${idx + 1}`,
      title: `Option ${idx + 1}: ${c.items.map((i) => i.foodItem.name).join(' + ')}`,
      badge: badges[idx] || `Option ${idx + 1}`,
      matchScore: c.score,
      totalCalories: c.totalCalories,
      totalProtein: c.totalProtein,
      totalCarbs: c.totalCarbs,
      totalFat: c.totalFat,
      totalPrice: c.totalPrice,
      items: c.items,
      explanation: expl,
    };
  });

  const bestCombo = topCombos[0];

  return {
    preset,
    matchScore: bestCombo.matchScore,
    totalCalories: bestCombo.totalCalories,
    totalProtein: bestCombo.totalProtein,
    totalCarbs: bestCombo.totalCarbs,
    totalFat: bestCombo.totalFat,
    totalPrice: bestCombo.totalPrice,
    items: bestCombo.items,
    explanation: bestCombo.explanation,
    topCombos,
  };
}
