import { FoodItem, CategoryOption } from '../types';

export const CATEGORIES: CategoryOption[] = [
  {
    id: 1,
    name: 'Burger',
    displayName: 'Burgers & Sandwiches',
    icon: 'Beef',
    description: 'Juicy handcrafted patties & toasted artisanal sandwiches',
    itemCount: 7,
  },
  {
    id: 2,
    name: 'Pizza',
    displayName: 'Pizza',
    icon: 'Pizza',
    description: 'Stone-baked thin crust pizzas topped with rich mozzarella',
    itemCount: 4,
  },
  {
    id: 3,
    name: 'Pasta',
    displayName: 'Pasta',
    icon: 'UtensilsCrossed',
    description: 'Silky pasta tossed in rich, simmered artisanal sauces',
    itemCount: 4,
  },
  {
    id: 4,
    name: 'Chinese',
    displayName: 'Chinese',
    icon: 'Flame',
    description: 'Wok-tossed noodles, fragrant rice, and spicy Manchurians',
    itemCount: 6,
  },
  {
    id: 5,
    name: 'Biryani',
    displayName: 'Biryani',
    icon: 'Soup',
    description: 'Long-grain basmati rice layered with aromatic spices',
    itemCount: 4,
  },
  {
    id: 6,
    name: 'Indian Curry',
    displayName: 'Indian Curry',
    icon: 'Bowl',
    description: 'Rich, slow-simmered gravies infused with authentic spices',
    itemCount: 4,
  },
  {
    id: 7,
    name: 'Breads',
    displayName: 'Breads',
    icon: 'Wheat',
    description: 'Freshly baked tandoori naans, rotis, and layered parottas',
    itemCount: 5,
  },
  {
    id: 8,
    name: 'Grill',
    displayName: 'Grills & Tandoor',
    icon: 'Drumstick',
    description: 'Smoky tandoori delicacies, charred grills, and sizzlers',
    itemCount: 6,
  },
  {
    id: 9,
    name: 'Starters',
    displayName: 'Starters',
    icon: 'Cookie',
    description: 'Crispy, golden appetizers, fries, and steamed momos',
    itemCount: 4,
  },
  {
    id: 10,
    name: 'Dessert',
    displayName: 'Desserts',
    icon: 'Cake',
    description: 'Indulgent brownies, sundae scoops, and warm lava cakes',
    itemCount: 4,
  },
  {
    id: 11,
    name: 'Beverage',
    displayName: 'Beverages',
    icon: 'Coffee',
    description: 'Chilled coffees, thick milkshakes, and refreshing sodas',
    itemCount: 4,
  },
];

export const MENU_ITEMS: FoodItem[] = [
  // ================================
  // Burgers & Sandwiches (1..7)
  // ================================
  {
    id: 1,
    name: 'Classic Burger',
    category: 'Burger',
    price: 120,
    isVeg: true,
    description: 'Fresh crisp veg patty, tomatoes, lettuce, and signature garlic aioli sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    prepTime: '12-15 mins',
    rating: 4.6,
    tags: ['Popular', 'Bestseller']
  },
  {
    id: 2,
    name: 'Cheese Burger',
    category: 'Burger',
    price: 150,
    isVeg: true,
    description: 'Melted cheddar cheese over a spiced patty with caramelized onions and house relish.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    prepTime: '12-15 mins',
    rating: 4.8,
    tags: ['Chef Special']
  },
  {
    id: 3,
    name: 'Chicken Burger',
    category: 'Burger',
    price: 180,
    isVeg: false,
    description: 'Crispy fried chicken fillet topped with coleslaw and tangy smoked mayo.',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 mins',
    rating: 4.7,
    tags: ['Non-Veg', 'Bestseller']
  },
  {
    id: 4,
    name: 'Double Chicken Burger',
    category: 'Burger',
    price: 240,
    isVeg: false,
    description: 'Double grilled chicken patties layered with cheese slice, jalapeños, and smoky barbecue sauce.',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    prepTime: '18 mins',
    rating: 4.9,
    tags: ['Heavy Bite']
  },
  {
    id: 5,
    name: 'Veg Sandwich',
    category: 'Burger',
    price: 110,
    isVeg: true,
    description: 'Fresh farm cucumbers, tomatoes, bell peppers, and mint chutney in multigrain bread.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    prepTime: '10 mins',
    rating: 4.4,
    tags: ['Light Meal']
  },
  {
    id: 6,
    name: 'Grilled Sandwich',
    category: 'Burger',
    price: 150,
    isVeg: true,
    description: 'Butter-toasted white bread stuffed with spiced potatoes, sweet corn, and melted mozzarella.',
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=800&q=80',
    prepTime: '12 mins',
    rating: 4.6,
    tags: ['Crispy']
  },
  {
    id: 7,
    name: 'Club Sandwich',
    category: 'Burger',
    price: 180,
    isVeg: false,
    description: 'Triple-decker toasted sandwich filled with shredded chicken, boiled egg, lettuce, and mayo.',
    image: 'https://img.freepik.com/free-photo/side-view-club-sandwich-with-salted-cucumbers-lemon-olives-round-white-plate_176474-3049.jpg?semt=ais_hybrid&w=740&q=80',
    prepTime: '15 mins',
    rating: 4.7,
    tags: ['Classic']
  },

  // ================================
  // Pizza (8..11)
  // ================================
  {
    id: 8,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 250,
    isVeg: true,
    description: 'Classic stone-baked dough topped with San Marzano tomato sauce, fresh mozzarella, and basil.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    prepTime: '15-20 mins',
    rating: 4.8,
    tags: ['Classic', 'Veg']
  },
  {
    id: 9,
    name: 'Farmhouse Pizza',
    category: 'Pizza',
    price: 320,
    isVeg: true,
    description: 'Loaded with crunchy bell peppers, sweet corn, black olives, red onions, and mushroom.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    prepTime: '18 mins',
    rating: 4.7,
    tags: ['Loaded']
  },
  {
    id: 10,
    name: 'Veg Supreme Pizza',
    category: 'Pizza',
    price: 340,
    isVeg: true,
    description: 'Deluxe toppings featuring paneer cubes, jalapeños, baby corn, olives, and extra cheese.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 mins',
    rating: 4.8,
    tags: ['Supreme']
  },
  {
    id: 11,
    name: 'Chicken BBQ Pizza',
    category: 'Pizza',
    price: 390,
    isVeg: false,
    description: 'Smoky barbecue chicken chunks, caramelized red onions, coriander, and double cheese.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 mins',
    rating: 4.9,
    tags: ['Bestseller', 'Smoky']
  },

  // ================================
  // Pasta (12..15)
  // ================================
  {
    id: 12,
    name: 'White Sauce Pasta',
    category: 'Pasta',
    price: 220,
    isVeg: true,
    description: 'Penne pasta cooked in rich creamy parmesan bechamel sauce with garlic and herbs.',
    image: 'https://lilluna.com/wp-content/uploads/2022/11/white-sauce-pasta-resize-10.jpg',
    prepTime: '15 mins',
    rating: 4.7,
    tags: ['Creamy']
  },
  {
    id: 13,
    name: 'Red Sauce Pasta',
    category: 'Pasta',
    price: 210,
    isVeg: true,
    description: 'Tangy Italian arrabbiata plum tomato sauce infused with chilli flakes, garlic, and fresh basil.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 mins',
    rating: 4.5,
    spicyLevel: 1,
    tags: ['Zesty']
  },
  {
    id: 14,
    name: 'Pink Sauce Pasta',
    category: 'Pasta',
    price: 240,
    isVeg: true,
    description: 'Harmonious blend of rich cream and tangy arrabbiata sauce topped with broccoli & zucchini.',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    prepTime: '16 mins',
    rating: 4.8,
    tags: ['Chef Recommended']
  },
  {
    id: 15,
    name: 'Chicken Alfredo Pasta',
    category: 'Pasta',
    price: 310,
    isVeg: false,
    description: 'Succulent grilled chicken breast sliced over fettuccine tossed in buttery parmesan cream.',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
    prepTime: '18 mins',
    rating: 4.9,
    tags: ['Rich & Creamy']
  },

  // ================================
  // Chinese (16..21)
  // ================================
  {
    id: 16,
    name: 'Veg Fried Rice',
    category: 'Chinese',
    price: 180,
    isVeg: true,
    description: 'Wok-tossed basmati rice with finely chopped carrots, beans, spring onions, and white pepper.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    prepTime: '12 mins',
    rating: 4.5,
    tags: ['Wok Tossed']
  },
  {
    id: 17,
    name: 'Chicken Fried Rice',
    category: 'Chinese',
    price: 230,
    isVeg: false,
    description: 'Classic wok rice with tender chicken pieces, scrambled egg, and Asian aromatic spices.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    prepTime: '14 mins',
    rating: 4.8,
    tags: ['Bestseller']
  },
  {
    id: 18,
    name: 'Veg Noodles',
    category: 'Chinese',
    price: 170,
    isVeg: true,
    description: 'Stir-friedhakka noodles tossed with cabbage, bell peppers, soy sauce, and sesame oil.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    prepTime: '12 mins',
    rating: 4.6,
    tags: ['Hakka Style']
  },
  {
    id: 19,
    name: 'Chicken Noodles',
    category: 'Chinese',
    price: 240,
    isVeg: false,
    description: 'Savory stir-fried noodles cooked with shredded chicken, crunchy vegetables, and chilli sauce.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 mins',
    rating: 4.7,
    spicyLevel: 1,
    tags: ['Savor']
  },
  {
    id: 20,
    name: 'Gobi Manchurian',
    category: 'Chinese',
    price: 190,
    isVeg: true,
    description: 'Crispy fried cauliflower florets coated in a spicy, tangy Indo-Chinese garlic soy glaze.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 mins',
    rating: 4.8,
    spicyLevel: 2,
    tags: ['Crispy & Tangy']
  },
  {
    id: 21,
    name: 'Chicken Manchurian',
    category: 'Chinese',
    price: 260,
    isVeg: false,
    description: 'Juicy chicken meatballs tossed in dark soy sauce, fresh garlic, ginger, and green chillies.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    prepTime: '16 mins',
    rating: 4.8,
    spicyLevel: 2,
    tags: ['Indo-Chinese']
  },

  // ================================
  // Biryani (22..25)
  // ================================
  {
    id: 22,
    name: 'Veg Biryani',
    category: 'Biryani',
    price: 180,
    isVeg: true,
    description: 'Fragrant basmati rice layered with garden vegetables, saffron, mint, and slow dum spice.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    prepTime: '18 mins',
    rating: 4.6,
    tags: ['Dum Cooked']
  },
  {
    id: 23,
    name: 'Chicken Biryani',
    category: 'Biryani',
    price: 260,
    isVeg: false,
    description: 'Tender marinated chicken pieces cooked on dum with long-grain rice, ghee, and roasted onions.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 mins',
    rating: 4.9,
    spicyLevel: 2,
    tags: ['Bestseller', 'Signature']
  },
  {
    id: 24,
    name: 'Mutton Biryani',
    category: 'Biryani',
    price: 340,
    isVeg: false,
    description: 'Succulent slow-cooked mutton chunks infused with whole spices and rich saffron basmati rice.',
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80',
    prepTime: '22 mins',
    rating: 4.9,
    spicyLevel: 2,
    tags: ['Royal Feast']
  },
  {
    id: 25,
    name: 'Hyderabadi Chicken Biryani',
    category: 'Biryani',
    price: 320,
    isVeg: false,
    description: 'Authentic spicy Nizami style dum biryani garnished with fried onions, coriander, and boiled egg.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 mins',
    rating: 4.9,
    spicyLevel: 3,
    tags: ['Authentic Hyderabadi']
  },

  // ================================
  // Indian Curry (26..29)
  // ================================
  {
    id: 26,
    name: 'Paneer Butter Masala',
    category: 'Indian Curry',
    price: 220,
    isVeg: true,
    description: 'Soft cottage cheese cubes cooked in a silky, butter-rich tomato cashew cream gravy.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 mins',
    rating: 4.8,
    tags: ['Rich & Creamy']
  },
  {
    id: 27,
    name: 'Chicken Butter Masala',
    category: 'Indian Curry',
    price: 280,
    isVeg: false,
    description: 'Marinated chicken simmered in a mildly spiced, aromatic tomato cream sauce.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    prepTime: '18 mins',
    rating: 4.9,
    tags: ['House Favorite']
  },
  {
    id: 28,
    name: 'Butter Chicken',
    category: 'Indian Curry',
    price: 300,
    isVeg: false,
    description: 'Tandoori chicken tikka pieces cooked in rich, velvety tomato and fenugreek butter gravy.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    prepTime: '18 mins',
    rating: 5.0,
    tags: ['All-Time Iconic']
  },
  {
    id: 29,
    name: 'Kadai Paneer',
    category: 'Indian Curry',
    price: 240,
    isVeg: true,
    description: 'Paneer cubes cooked with coarsely ground kadai spices, onions, and crisp bell peppers.',
    image: 'https://img.freepik.com/free-photo/pre-prepared-food-showcasing-ready-eat-delicious-meals-go_23-2151246089.jpg?semt=ais_hybrid&w=740&q=80',
    prepTime: '15 mins',
    rating: 4.7,
    spicyLevel: 2,
    tags: ['Spiced']
  },

  // ================================
  // Breads (30..34)
  // ================================
  {
    id: 30,
    name: 'Butter Naan',
    category: 'Breads',
    price: 35,
    isVeg: true,
    description: 'Soft tandoori flatbread brushed generously with salted white butter.',
    image: 'https://img.freepik.com/free-photo/top-view-pakistani-meal-arrangement_23-2148825100.jpg?semt=ais_hybrid&w=740&q=80',
    prepTime: '8 mins',
    rating: 4.8,
    tags: ['Tandoori']
  },
  {
    id: 31,
    name: 'Garlic Naan',
    category: 'Breads',
    price: 50,
    isVeg: true,
    description: 'Tandoori naan topped with chopped minced garlic, coriander, and melted butter.',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/034/596/901/small/indian-naan-bread-with-parsley-generated-with-ai-photo.jpg',
    prepTime: '8 mins',
    rating: 4.9,
    tags: ['Garlic Infused']
  },
  {
    id: 32,
    name: 'Butter Roti',
    category: 'Breads',
    price: 25,
    isVeg: true,
    description: 'Whole wheat tandoori roti baked over clay oven and smeared with butter.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    prepTime: '6 mins',
    rating: 4.5,
    tags: ['Healthy Whole Wheat']
  },
  {
    id: 33,
    name: 'Parotta',
    category: 'Breads',
    price: 25,
    isVeg: true,
    description: 'Flaky, layered South Indian refined flour flatbread crushed soft.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8tcxYCWDdX5kWT3z4qgra6SDe460BWlMamSqjThCPgg&s=10',
    prepTime: '8 mins',
    rating: 4.7,
    tags: ['Flaky Layered']
  },
  {
    id: 34,
    name: 'Kerala Parotta',
    category: 'Breads',
    price: 35,
    isVeg: true,
    description: 'Authentic Malabar spiral layered parotta with crisp golden edges.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5nVSosFHMsdzG-44q6cfZAoxo16Q1O4esF93b3GyXDA&s=10',
    prepTime: '8 mins',
    rating: 4.8,
    tags: ['Malabar Style']
  },

  // ================================
  // Grills & Tandoor (35..40)
  // ================================
  {
    id: 35,
    name: 'Chicken 65',
    category: 'Grill',
    price: 240,
    isVeg: false,
    description: 'Spicy deep-fried chicken cubes tempered with curry leaves, mustard seeds, and red chillies.',
    image: 'https://www.shutterstock.com/image-photo/indian-cuisine-hot-red-chicken-260nw-2587733465.jpg',
    prepTime: '15 mins',
    rating: 4.8,
    spicyLevel: 3,
    tags: ['Fiery Starter']
  },
  {
    id: 36,
    name: 'Dragon Chicken',
    category: 'Grill',
    price: 280,
    isVeg: false,
    description: 'Crispy chicken strips tossed in red chilli sauce, cashew nuts, and bell pepper juliennes.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXrcl2rz6SyPgwb5Of2bGqu3-4-xyyuqBlPC01acWZow&s=10',
    prepTime: '16 mins',
    rating: 4.7,
    spicyLevel: 2,
    tags: ['Crunchy']
  },
  {
    id: 37,
    name: 'Grill Chicken Half',
    category: 'Grill',
    price: 420,
    isVeg: false,
    description: 'Half bone-in chicken marinated in Arabian spices and charcoal grilled to perfection.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQtpZNxB3oabugj1X04smI8y8UZrn7OM7OSoUngupWOQ&s=10',
    prepTime: '20 mins',
    rating: 4.8,
    tags: ['Charcoal Grilled']
  },
  {
    id: 38,
    name: 'Grill Chicken Full',
    category: 'Grill',
    price: 760,
    isVeg: false,
    description: 'Whole chicken marinated in garlic herbs & Arabic spices, served with mint dip and pita.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBoPU_dVsCEs95Mbh9hBKMTvRvsbOg4jBCoon7UmQD4w&s',
    prepTime: '25 mins',
    rating: 4.9,
    tags: ['Family Feast']
  },
  {
    id: 39,
    name: 'Tandoori Chicken Half',
    category: 'Grill',
    price: 400,
    isVeg: false,
    description: 'Traditional clay oven roasted chicken seasoned with yoghurt, red chilli, and chat masala.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRqZAaTkppD0vIX3ePZveU7w0nsnA6yxs58a0wipep3g&s=10',
    prepTime: '22 mins',
    rating: 4.9,
    spicyLevel: 2,
    tags: ['Clay Oven']
  },
  {
    id: 40,
    name: 'Tandoori Chicken Full',
    category: 'Grill',
    price: 720,
    isVeg: false,
    description: 'Full tandoori roasted chicken served with sliced onions, mint chutney, and lemon wedges.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7PthlJQeeInsTNjEKPKF0wd1klQDBn8nk2XiNjyIisA&s=10',
    prepTime: '28 mins',
    rating: 4.9,
    spicyLevel: 2,
    tags: ['Party Platter']
  },

  // ================================
  // Starters (41..44)
  // ================================
  {
    id: 41,
    name: 'French Fries',
    category: 'Starters',
    price: 90,
    isVeg: true,
    description: 'Golden, extra crispy potato batons lightly salted and served with tomato ketchup.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    prepTime: '10 mins',
    rating: 4.5,
    tags: ['Crispy']
  },
  {
    id: 42,
    name: 'Peri Peri Fries',
    category: 'Starters',
    price: 120,
    isVeg: true,
    description: 'Hot crisp fries dusted with fiery spicy African peri-peri seasoning blend.',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    prepTime: '10 mins',
    rating: 4.7,
    spicyLevel: 2,
    tags: ['Spicy Crunch']
  },
  {
    id: 43,
    name: 'Veg Momos',
    category: 'Starters',
    price: 130,
    isVeg: true,
    description: 'Steamed Himalayan dumplings stuffed with finely minced cabbage, carrots, and spring onion.',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 mins',
    rating: 4.6,
    tags: ['Himalayan Steamed']
  },
  {
    id: 44,
    name: 'Chicken Momos',
    category: 'Starters',
    price: 170,
    isVeg: false,
    description: 'Soft steamed dumplings stuffed with spiced chicken mince served with fiery red sesame dip.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 mins',
    rating: 4.8,
    spicyLevel: 1,
    tags: ['Bestseller']
  },

  // ================================
  // Desserts (45..48)
  // ================================
  {
    id: 45,
    name: 'Chocolate Brownie',
    category: 'Dessert',
    price: 160,
    isVeg: true,
    description: 'Fudgy warm dark chocolate brownie topped with chocolate drizzle and walnuts.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    prepTime: '5 mins',
    rating: 4.8,
    tags: ['Indulgent']
  },
  {
    id: 46,
    name: 'Ice Cream Sundae',
    category: 'Dessert',
    price: 180,
    isVeg: true,
    description: 'Triple scoops of vanilla & chocolate ice cream with tutti frutti, nuts, and cherry.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    prepTime: '5 mins',
    rating: 4.7,
    tags: ['Chilled Treat']
  },
  {
    id: 47,
    name: 'Gulab Jamun',
    category: 'Dessert',
    price: 90,
    isVeg: true,
    description: 'Two soft golden milk solid dumplings soaked in warm rose and cardamom sugar syrup.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6xyvtQ-fFN3iXz3_7CJqBH3z7f1pLYd-GcC79fJ-IcA&s=10',
    prepTime: '5 mins',
    rating: 4.8,
    tags: ['Traditional Sweet']
  },
  {
    id: 48,
    name: 'Chocolate Lava Cake',
    category: 'Dessert',
    price: 190,
    isVeg: true,
    description: 'Warm chocolate sponge cake with a molten chocolate center oozing on cut.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRne1qVx2zp0olsDTDt3iKDS26ZARaOO_w6rY1Xl_xfmg&s=10',
    prepTime: '8 mins',
    rating: 4.9,
    tags: ['Molten Delight']
  },

  // ================================
  // Beverages (49..52)
  // ================================
  {
    id: 49,
    name: 'Cold Coffee',
    category: 'Beverage',
    price: 110,
    isVeg: true,
    description: 'Blended espresso coffee with chilled milk, cream, and vanilla scoop.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    prepTime: '5 mins',
    rating: 4.7,
    tags: ['Refreshing']
  },
  {
    id: 50,
    name: 'Coke',
    category: 'Beverage',
    price: 40,
    isVeg: true,
    description: 'Chilled 330ml Coca-Cola glass bottle served with ice and lemon slice.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTime: '2 mins',
    rating: 4.6,
    tags: ['Classic Soda']
  },
  {
    id: 51,
    name: 'Fresh Lime Soda',
    category: 'Beverage',
    price: 70,
    isVeg: true,
    description: 'Freshly squeezed lime juice with sparkling soda water (Sweet, Salted or Mixed).',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    prepTime: '4 mins',
    rating: 4.8,
    tags: ['Zesty Cooler']
  },
  {
    id: 52,
    name: 'Chocolate Milkshake',
    category: 'Beverage',
    price: 150,
    isVeg: true,
    description: 'Thick creamy chocolate milkshake topped with cocoa powder and chocolate chips.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    prepTime: '6 mins',
    rating: 4.8,
    tags: ['Thick Shake']
  },
];
