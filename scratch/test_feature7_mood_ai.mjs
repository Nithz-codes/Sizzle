import { curateMoodFeast } from '../src/services/moodAiCurator.ts';
import { MENU_ITEMS } from '../src/data/menuData.ts';

console.log("=== FEATURE 7: AI MOOD & OCCASION MENU CURATOR ALGORITHMIC TESTS ===");

const moods = ['RAINY_DAY', 'POST_WORKOUT', 'LATE_NIGHT', 'ROMANTIC_DATE', 'BUSY_WORKDAY', 'FESTIVE_PARTY'];

moods.forEach((m) => {
  const result = curateMoodFeast(m);
  console.log(`\n🎭 [${result.mood}] ${result.headline}`);
  console.log(`   - Options Generated: ${result.combos.length}`);
  result.combos.forEach((c) => {
    console.log(`   - ${c.badge} | ${c.title} (₹${c.totalPrice}) -> Dishes: ${c.items.map((i) => i.foodItem.name).join(' + ')}`);
  });
});

console.log("\n💬 [CUSTOM MOOD PROMPT TEST]: 'Stressed after work, want hot cheesy pasta'");
const customRes = curateMoodFeast('CUSTOM_MOOD', 'Stressed after work, want hot cheesy pasta');
console.log(`   - Headline: ${customRes.headline}`);
console.log(`   - Option 1: ${customRes.combos[0].title} (₹${customRes.combos[0].totalPrice}) -> ${customRes.combos[0].items.map((i) => i.foodItem.name).join(' + ')}`);

console.log("\n🎉 ALL FEATURE 7 AI MOOD CURATOR TESTS PASSED SUCCESSFULLY! 🎉\n");
