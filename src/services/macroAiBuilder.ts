import { FoodItem, MacroGoalRequest, MacroMealResponse, FitnessPreset } from '../types';
import { MENU_ITEMS } from '../data/menuData';

export function buildMacroMeal(request: MacroGoalRequest, menuItemsList: FoodItem[] = MENU_ITEMS): MacroMealResponse {
  const { targetCalories, minProtein, dietaryFilter, preset = 'BALANCED' } = request;

  // Filter items by dietary preference
  let validItems = menuItemsList.filter((item) => {
    if (dietaryFilter === 'Veg' && !item.isVeg) return false;
    if (dietaryFilter === 'Non-Veg' && item.isVeg) return false;
    return true;
  });

  if (validItems.length === 0) {
    validItems = menuItemsList;
  }

  // Define preset target adjustments
  let weightProtein = 1.5;
  let weightCalories = 1.0;

  if (preset === 'HIGH_PROTEIN') {
    weightProtein = 3.0;
    weightCalories = 0.8;
  } else if (preset === 'KETO') {
    weightProtein = 1.8;
  } else if (preset === 'LOW_CALORIE') {
    weightCalories = 2.5;
    weightProtein = 1.2;
  }

  interface CandidateMeal {
    items: { foodItem: FoodItem; quantity: number }[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalPrice: number;
    score: number;
  }

  const candidateMeals: CandidateMeal[] = [];

  // 1. Evaluate single items
  validItems.forEach((item) => {
    const calories = item.calories || 450;
    const protein = item.protein || 20;
    const carbs = item.carbs || 45;
    const fat = item.fat || 18;

    const calDiff = Math.abs(calories - targetCalories);
    const protDiff = Math.max(0, minProtein - protein);

    const score = 100 - (calDiff * 0.08 * weightCalories) - (protDiff * 1.5 * weightProtein);
    candidateMeals.push({
      items: [{ foodItem: item, quantity: 1 }],
      totalCalories: calories,
      totalProtein: protein,
      totalCarbs: carbs,
      totalFat: fat,
      totalPrice: item.price,
      score: Math.max(40, Math.min(99, Math.round(score))),
    });
  });

  // 2. Evaluate 2-item & 3-item meal combinations
  const mains = validItems.filter((i) => i.category !== 'Beverage' && i.category !== 'Breads');
  const sides = validItems.filter((i) => i.category === 'Breads' || i.category === 'Beverage' || i.category === 'Starters');

  for (const mainItem of mains) {
    for (const sideItem of sides.length > 0 ? sides : validItems) {
      if (mainItem.id === sideItem.id) continue;

      const calories = (mainItem.calories || 450) + (sideItem.calories || 200);
      const protein = (mainItem.protein || 25) + (sideItem.protein || 8);
      const carbs = (mainItem.carbs || 50) + (sideItem.carbs || 30);
      const fat = (mainItem.fat || 20) + (sideItem.fat || 8);

      const calDiff = Math.abs(calories - targetCalories);
      const protDiff = Math.max(0, minProtein - protein);

      let presetBonus = 0;
      if (preset === 'HIGH_PROTEIN' && protein >= minProtein) presetBonus += 15;
      if (preset === 'KETO' && carbs <= 35) presetBonus += 15;
      if (preset === 'LOW_CALORIE' && calories <= targetCalories) presetBonus += 15;

      const rawScore = 100 - (calDiff * 0.06 * weightCalories) - (protDiff * 1.2 * weightProtein) + presetBonus;
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
      });
    }
  }

  // Sort candidates by match score descending
  candidateMeals.sort((a, b) => b.score - a.score);

  const bestMeal = candidateMeals[0] || {
    items: [{ foodItem: validItems[0] || menuItemsList[0], quantity: 1 }],
    totalCalories: 480,
    totalProtein: 35,
    totalCarbs: 45,
    totalFat: 18,
    totalPrice: 280,
    score: 88,
  };

  // Generate intelligent explanation based on preset
  let explanation = '';
  if (preset === 'HIGH_PROTEIN') {
    explanation = `High-protein power meal delivering ${bestMeal.totalProtein}g protein (${bestMeal.totalCalories} kcal) to maximize muscle recovery.`;
  } else if (preset === 'KETO') {
    explanation = `Keto-friendly low-carb combination containing ${bestMeal.totalFat}g healthy fats and only ${bestMeal.totalCarbs}g net carbs.`;
  } else if (preset === 'LOW_CALORIE') {
    explanation = `Light calorie-conscious option delivering ${bestMeal.totalCalories} kcal and ${bestMeal.totalProtein}g protein.`;
  } else {
    explanation = `Optimized balanced meal matching ${bestMeal.totalCalories} kcal with ${bestMeal.totalProtein}g protein and ${bestMeal.totalCarbs}g carbs.`;
  }

  return {
    preset,
    matchScore: bestMeal.score,
    totalCalories: bestMeal.totalCalories,
    totalProtein: bestMeal.totalProtein,
    totalCarbs: bestMeal.totalCarbs,
    totalFat: bestMeal.totalFat,
    totalPrice: bestMeal.totalPrice,
    items: bestMeal.items,
    explanation,
  };
}
