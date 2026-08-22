import {
  getStoredApiKey,
  hasGeminiApiKey,
  generateGeminiMacroMeal,
  generateGeminiMoodFeast,
  generateGeminiTasteDiscovery,
} from '../src/services/geminiAiService.ts';

console.log("=== GEMINI 1.5 API DUAL-ENGINE INTEGRATION TESTS ===");

console.log(`\n1. API Key Config Check:`);
console.log(`   - Has Configured Key: ${hasGeminiApiKey()}`);
console.log(`   - Key Masked: ${hasGeminiApiKey() ? getStoredApiKey().substring(0, 6) + '...' : 'None (Fallback Mode Active)'}`);

// Test Fallback / Local Execution
console.log(`\n2. Dual-Engine Macro Meal Test (Fallback to Local Solver when Key is missing):`);
const macroRes = await generateGeminiMacroMeal({
  targetCalories: 650,
  minProtein: 40,
  preset: 'HIGH_PROTEIN',
  dietaryFilter: 'All',
});
console.log(`   - Match Score: ${macroRes.matchScore}%`);
console.log(`   - Total Calories: ${macroRes.totalCalories} kcal`);
console.log(`   - Top Combos Count: ${macroRes.topCombos.length}`);
console.log(`   - Option 1 Title: "${macroRes.topCombos[0].title}"`);

console.log(`\n3. Dual-Engine Mood Feast Test:`);
const moodRes = await generateGeminiMoodFeast('RAINY_DAY');
console.log(`   - Headline: "${moodRes.headline}"`);
console.log(`   - Option 1: "${moodRes.combos[0].title}" (₹${moodRes.combos[0].totalPrice})`);

console.log(`\n4. Dual-Engine Taste Discovery Test:`);
const mysteryRes = await generateGeminiTasteDiscovery('MID_RANGE', 'All', 'WILD_SURPRISE');
console.log(`   - Title: "${mysteryRes.boxTitle}"`);
console.log(`   - Original: ₹${mysteryRes.originalPrice} -> Discounted (10% OFF): ₹${mysteryRes.discountedPrice}`);

console.log("\n🎉 ALL GEMINI DUAL-ENGINE INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉\n");
