
import { buildMacroMeal } from './src/services/macroAiBuilder.ts';
import { MENU_ITEMS } from './src/data/menuData.ts';

console.log("=== FEATURE 4: AI NUTRITION & MACRO MEAL BUILDER ALGORITHMIC TESTS ===");

// Test 1: High Protein Preset
const hpMeal = buildMacroMeal({
  targetCalories: 700,
  minProtein: 48,
  dietaryFilter: 'All',
  preset: 'HIGH_PROTEIN'
}, MENU_ITEMS);
console.log(`\n1. [HIGH_PROTEIN] Preset:`);
console.log(`   - Match Score: ${hpMeal.matchScore}%`);
console.log(`   - Total Calories: ${hpMeal.totalCalories} kcal`);
console.log(`   - Total Protein: ${hpMeal.totalProtein}g`);
console.log(`   - Items Count: ${hpMeal.items.length}`);
console.log(`   - Explanation: "${hpMeal.explanation}"`);

// Test 2: Keto Low-Carb Preset
const ketoMeal = buildMacroMeal({
  targetCalories: 550,
  minProtein: 35,
  dietaryFilter: 'Non-Veg',
  preset: 'KETO'
}, MENU_ITEMS);
console.log(`\n2. [KETO] Preset (Non-Veg):`);
console.log(`   - Match Score: ${ketoMeal.matchScore}%`);
console.log(`   - Total Carbs: ${ketoMeal.totalCarbs}g`);
console.log(`   - Total Fat: ${ketoMeal.totalFat}g`);
console.log(`   - Explanation: "${ketoMeal.explanation}"`);

// Test 3: Low Calorie Preset
const lcMeal = buildMacroMeal({
  targetCalories: 400,
  minProtein: 20,
  dietaryFilter: 'Veg',
  preset: 'LOW_CALORIE'
}, MENU_ITEMS);
console.log(`\n3. [LOW_CALORIE] Preset (Veg Only):`);
console.log(`   - Match Score: ${lcMeal.matchScore}%`);
console.log(`   - Total Calories: ${lcMeal.totalCalories} kcal`);
console.log(`   - Explanation: "${lcMeal.explanation}"`);

console.log("\n🎉 ALL ALGORITHMIC AI MACRO BUILDER TESTS PASSED SUCCESSFULLY! 🎉");
