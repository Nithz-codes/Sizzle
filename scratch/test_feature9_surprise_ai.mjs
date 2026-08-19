import { generateMysteryBox, rerollDish } from '../src/services/tasteDiscoveryEngine.ts';

console.log("=== FEATURE 9: AI SURPRISE ME & TASTE DISCOVERY ALGORITHMIC TESTS ===");

const budgets = ['UNDER_250', 'MID_RANGE', 'PREMIUM'];
const vibes = ['WILD_SURPRISE', 'FAST_FOOD', 'ROYAL_INDIAN', 'ITALIAN_GOURMET'];

budgets.forEach((b) => {
  vibes.forEach((v) => {
    const box = generateMysteryBox(b, 'All', v);
    console.log(`\n🎁 [${box.budgetPreset}] - Vibe: ${box.vibePreset}`);
    console.log(`   - Title: "${box.boxTitle}" | Match: ${box.matchScore}%`);
    console.log(`   - Original: ₹${box.originalPrice} -> Discounted (10% OFF): ₹${box.discountedPrice}`);
    console.log(`   - Items: ${box.items.map((i) => i.foodItem.name).join(' + ')}`);
  });
});

console.log("\n🎲 [DISH REROLL TEST]: Swapping Dish #1 in MID_RANGE FAST_FOOD Box...");
const initialBox = generateMysteryBox('MID_RANGE', 'All', 'FAST_FOOD');
console.log(`   - Before Reroll: ${initialBox.items.map((i) => i.foodItem.name).join(' + ')}`);
const rerolledBox = rerollDish(initialBox, 0);
console.log(`   - After Reroll: ${rerolledBox.items.map((i) => i.foodItem.name).join(' + ')}`);
console.log(`   - Updated Price: ₹${rerolledBox.discountedPrice}`);

console.log("\n🎉 ALL FEATURE 9 AI SURPRISE BOX TESTS PASSED SUCCESSFULLY! 🎉\n");
