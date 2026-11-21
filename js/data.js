/* WAYOF v6 — static content: equipment, exercises, recipes, coach lines */
window.WAYOF_DATA = (function () {
  const equipment = ['Bodyweight', 'Exercise mat', 'Dumbbells', 'Adjustable dumbbells', 'Barbell', 'Weight plates', 'Weight bench', 'Resistance bands', 'Pull-up bar', 'Kettlebell', 'Medicine ball', 'Jump rope', 'Foam roller', 'Stability ball', 'Suspension trainer', 'Cable machine', 'Smith machine', 'Squat rack', 'Leg press', 'Treadmill', 'Exercise bike', 'Rowing machine', 'Elliptical', 'Stair climber', 'Battle ropes', 'Sandbag', 'Step platform', 'Yoga blocks', 'Pilates reformer', 'Swimming pool', 'Outdoor track', 'Bicycle', 'Spin bike', 'Smart bike trainer', 'Running shoes', 'Heart rate monitor', 'GPS watch'];

  // focus: lower | push | pull | core | cardio | mobility
  const exercises = [
    { name: 'Bodyweight squat', gear: 'Bodyweight', focus: 'lower', icon: 'legs' },
    { name: 'Reverse lunge', gear: 'Bodyweight', focus: 'lower', icon: 'legs' },
    { name: 'Glute bridge', gear: 'Bodyweight', focus: 'lower', icon: 'legs' },
    { name: 'Incline push-up', gear: 'Bodyweight', focus: 'push', icon: 'push' },
    { name: 'Push-up', gear: 'Bodyweight', focus: 'push', icon: 'push' },
    { name: 'Pike push-up', gear: 'Bodyweight', focus: 'push', icon: 'push' },
    { name: 'Prone Y-T raise', gear: 'Bodyweight', focus: 'pull', icon: 'pull' },
    { name: 'Forearm plank', gear: 'Bodyweight', focus: 'core', icon: 'core' },
    { name: 'Dead bug', gear: 'Bodyweight', focus: 'core', icon: 'core' },
    { name: 'Bird dog', gear: 'Bodyweight', focus: 'core', icon: 'core' },
    { name: 'Brisk walking intervals', gear: 'Bodyweight', focus: 'cardio', icon: 'run', track: 'walk' },
    { name: 'Low-impact cardio circuit', gear: 'Bodyweight', focus: 'cardio', icon: 'run' },
    { name: 'Standing mobility flow', gear: 'Bodyweight', focus: 'mobility', icon: 'stretch' },
    { name: 'Hip flexor stretch', gear: 'Bodyweight', focus: 'mobility', icon: 'stretch' },
    { name: 'Yoga flow', gear: 'Exercise mat', focus: 'mobility', icon: 'stretch' },
    { name: 'Cat-cow & thoracic rotation', gear: 'Exercise mat', focus: 'mobility', icon: 'stretch' },
    { name: 'Goblet squat', gear: 'Dumbbells', focus: 'lower', icon: 'legs' },
    { name: 'Dumbbell Romanian deadlift', gear: 'Dumbbells', focus: 'lower', icon: 'legs' },
    { name: 'Dumbbell floor press', gear: 'Dumbbells', focus: 'push', icon: 'push' },
    { name: 'Dumbbell shoulder press', gear: 'Dumbbells', focus: 'push', icon: 'push' },
    { name: 'One-arm dumbbell row', gear: 'Dumbbells', focus: 'pull', icon: 'pull' },
    { name: 'Dumbbell curl', gear: 'Dumbbells', focus: 'pull', icon: 'pull' },
    { name: 'Band pull-apart', gear: 'Resistance bands', focus: 'pull', icon: 'pull' },
    { name: 'Band seated row', gear: 'Resistance bands', focus: 'pull', icon: 'pull' },
    { name: 'Band chest press', gear: 'Resistance bands', focus: 'push', icon: 'push' },
    { name: 'Kettlebell deadlift', gear: 'Kettlebell', focus: 'lower', icon: 'legs' },
    { name: 'Kettlebell swing', gear: 'Kettlebell', focus: 'cardio', icon: 'run' },
    { name: 'Barbell back squat', gear: 'Squat rack', focus: 'lower', icon: 'legs' },
    { name: 'Barbell deadlift', gear: 'Barbell', focus: 'lower', icon: 'legs' },
    { name: 'Bench press', gear: 'Weight bench', focus: 'push', icon: 'push' },
    { name: 'Pull-up / assisted pull-up', gear: 'Pull-up bar', focus: 'pull', icon: 'pull' },
    { name: 'Cable row', gear: 'Cable machine', focus: 'pull', icon: 'pull' },
    { name: 'Leg press', gear: 'Leg press', focus: 'lower', icon: 'legs' },
    { name: 'Treadmill incline walk', gear: 'Treadmill', focus: 'cardio', icon: 'run', track: 'treadmill' },
    { name: 'Bike intervals', gear: 'Exercise bike', focus: 'cardio', icon: 'bike', track: 'indoor' },
    { name: 'Rowing intervals', gear: 'Rowing machine', focus: 'cardio', icon: 'run' },
    { name: 'Elliptical steady state', gear: 'Elliptical', focus: 'cardio', icon: 'run' },
    { name: 'Stair climber', gear: 'Stair climber', focus: 'cardio', icon: 'run' },
    { name: 'Jump rope intervals', gear: 'Jump rope', focus: 'cardio', icon: 'run' },
    { name: 'Battle rope waves', gear: 'Battle ropes', focus: 'cardio', icon: 'run' },
    { name: 'Swimming laps', gear: 'Swimming pool', focus: 'cardio', icon: 'swim' },
    { name: 'Outdoor walk', gear: 'Bodyweight', focus: 'cardio', icon: 'run', track: 'walk' },
    { name: 'Easy run', gear: 'Bodyweight', focus: 'cardio', icon: 'run', track: 'run' },
    { name: 'Run intervals', gear: 'Running shoes', focus: 'cardio', icon: 'run', track: 'run' },
    { name: 'Stationary bike steady ride', gear: 'Exercise bike', focus: 'cardio', icon: 'bike', track: 'indoor' },
    { name: 'Spin bike intervals', gear: 'Spin bike', focus: 'cardio', icon: 'bike', track: 'indoor' },
    { name: 'Smart trainer ride', gear: 'Smart bike trainer', focus: 'cardio', icon: 'bike', track: 'indoor' },
    { name: 'Outdoor bike ride', gear: 'Bicycle', focus: 'cardio', icon: 'bike', track: 'ride' },
    { name: 'Foam roller release', gear: 'Foam roller', focus: 'mobility', icon: 'stretch' },
    { name: 'Stability ball dead bug', gear: 'Stability ball', focus: 'core', icon: 'core' },
    { name: 'Suspension row', gear: 'Suspension trainer', focus: 'pull', icon: 'pull' },
    { name: 'Medicine ball slam', gear: 'Medicine ball', focus: 'core', icon: 'core' }
  ];

  const focusNames = { lower: 'Lower body', push: 'Push', pull: 'Pull', core: 'Core', cardio: 'Cardio', mobility: 'Mobility' };

  const sessionTemplates = {
    strength: [['Full-body strength', ['lower', 'push', 'pull', 'core']], ['Upper-body strength', ['push', 'pull', 'push', 'pull']], ['Lower-body strength', ['lower', 'lower', 'core', 'mobility']], ['Full-body power', ['lower', 'pull', 'push', 'cardio']]],
    muscle: [['Upper push', ['push', 'push', 'push', 'core']], ['Lower body', ['lower', 'lower', 'lower', 'core']], ['Upper pull', ['pull', 'pull', 'pull', 'mobility']], ['Full-body volume', ['lower', 'push', 'pull', 'core']]],
    endurance: [['Cardio intervals', ['cardio', 'cardio', 'core']], ['Strength support', ['lower', 'pull', 'core']], ['Steady cardio', ['cardio', 'mobility']], ['Mobility & recovery', ['mobility', 'mobility', 'core']]],
    mobility: [['Mobility flow', ['mobility', 'mobility', 'mobility']], ['Core & stability', ['core', 'core', 'mobility']], ['Stretch & balance', ['mobility', 'lower', 'mobility']], ['Gentle conditioning', ['cardio', 'core', 'mobility']]],
    general: [['Full-body basics', ['lower', 'push', 'pull', 'core']], ['Cardio & core', ['cardio', 'core', 'core']], ['Move & mobilize', ['mobility', 'lower', 'mobility']], ['Full-body circuit', ['lower', 'push', 'cardio', 'core']]]
  };

  const goals = { strength: 'Build strength', muscle: 'Build muscle', endurance: 'Improve endurance', mobility: 'Mobility & flexibility', general: 'General wellness' };

  // art: ordered list of plate components (see foodArt in app.js)
  const recipes = [
    { id: 'salmon-bowl', name: 'Salmon Power Bowl', slot: 'lunch', min: 25, kcal: 520, p: 36, c: 42, f: 22, cost: 3, art: ['grain', 'salmon', 'avocado', 'tomato', 'greens'],
      ing: [['Salmon fillet', '5 oz'], ['Cooked quinoa', '¾ cup'], ['Avocado', '½'], ['Cherry tomatoes', '½ cup'], ['Baby spinach', '1 cup'], ['Lemon', '½']],
      steps: ['Season salmon with salt, pepper and lemon; roast at 400°F for 12–14 min.', 'Warm quinoa and arrange in a bowl with spinach.', 'Top with salmon, sliced avocado and halved tomatoes. Finish with lemon.'] },
    { id: 'chicken-bowl', name: 'Protein Power Bowl', slot: 'lunch', min: 30, kcal: 480, p: 42, c: 40, f: 14, cost: 2, art: ['grain', 'chicken', 'carrot', 'greens', 'avocado'],
      ing: [['Chicken breast', '5 oz'], ['Brown rice', '¾ cup cooked'], ['Shredded carrot', '½ cup'], ['Kale', '1 cup'], ['Avocado', '¼']],
      steps: ['Grill or pan-sear chicken until 165°F inside; slice.', 'Massage kale with a pinch of salt and a squeeze of lemon.', 'Build the bowl with rice, kale, carrot, chicken and avocado.'] },
    { id: 'spinach-omelet', name: 'Omelet with Spinach', slot: 'breakfast', min: 10, kcal: 310, p: 24, c: 6, f: 21, cost: 1, art: ['egg', 'greens', 'tomato'],
      ing: [['Eggs', '3'], ['Baby spinach', '1 cup'], ['Feta', '2 tbsp'], ['Olive oil', '1 tsp']],
      steps: ['Wilt spinach in oil over medium heat.', 'Pour in whisked eggs; cook gently until almost set.', 'Add feta, fold, and serve.'] },
    { id: 'berry-oats', name: 'Berry Overnight Oats', slot: 'breakfast', min: 5, kcal: 380, p: 20, c: 55, f: 9, cost: 1, art: ['oats', 'berries', 'yogurt', 'banana'],
      ing: [['Rolled oats', '½ cup'], ['Greek yogurt', '½ cup'], ['Milk', '½ cup'], ['Mixed berries', '½ cup'], ['Chia seeds', '1 tsp']],
      steps: ['Stir oats, yogurt, milk and chia in a jar.', 'Refrigerate overnight (or at least 4 hours).', 'Top with berries in the morning.'] },
    { id: 'avocado-toast', name: 'Avocado Egg Toast', slot: 'breakfast', min: 10, kcal: 420, p: 18, c: 36, f: 23, cost: 2, art: ['bread', 'avocado', 'egg', 'tomato'],
      ing: [['Whole-grain bread', '2 slices'], ['Avocado', '½'], ['Eggs', '2'], ['Chili flakes', 'pinch']],
      steps: ['Toast the bread.', 'Mash avocado with salt and lemon; spread on toast.', 'Top with fried or poached eggs and chili flakes.'] },
    { id: 'protein-pancakes', name: 'Protein Pancakes', slot: 'breakfast', min: 20, kcal: 390, p: 28, c: 45, f: 10, cost: 1, art: ['pancake', 'berries', 'banana'],
      ing: [['Rolled oats', '½ cup'], ['Banana', '1'], ['Eggs', '2'], ['Greek yogurt', '⅓ cup'], ['Berries', 'to serve']],
      steps: ['Blend oats, banana, eggs and yogurt until smooth.', 'Cook small pancakes on a lightly oiled pan, 2 min per side.', 'Serve with berries.'] },
    { id: 'chicken-wrap', name: 'Chicken Avocado Wrap', slot: 'lunch', min: 15, kcal: 470, p: 35, c: 38, f: 19, cost: 2, art: ['wrap', 'chicken', 'greens', 'tomato', 'avocado'],
      ing: [['Whole-wheat tortilla', '1 large'], ['Cooked chicken', '4 oz'], ['Avocado', '¼'], ['Lettuce', '1 cup'], ['Tomato', '½']],
      steps: ['Warm the tortilla.', 'Layer lettuce, chicken, tomato and avocado.', 'Roll tightly and slice in half.'] },
    { id: 'chickpea-salad', name: 'Mediterranean Chickpea Salad', slot: 'lunch', min: 15, kcal: 410, p: 15, c: 48, f: 18, cost: 1, art: ['chickpea', 'cucumber', 'tomato', 'feta', 'greens'],
      ing: [['Chickpeas', '1 cup'], ['Cucumber', '½'], ['Cherry tomatoes', '½ cup'], ['Feta', '2 tbsp'], ['Red onion', '2 tbsp'], ['Olive oil', '1 tbsp']],
      steps: ['Rinse chickpeas.', 'Chop vegetables and combine.', 'Dress with olive oil, lemon, salt and oregano; top with feta.'] },
    { id: 'turkey-chili', name: 'Turkey & Bean Chili', slot: 'dinner', min: 40, kcal: 450, p: 38, c: 40, f: 13, cost: 2, art: ['beef', 'beans', 'tomato', 'pepper'],
      ing: [['Ground turkey', '5 oz'], ['Kidney beans', '½ cup'], ['Crushed tomatoes', '1 cup'], ['Onion', '½'], ['Bell pepper', '½'], ['Chili powder', '1 tsp']],
      steps: ['Brown turkey with onion and pepper.', 'Add tomatoes, beans and spices.', 'Simmer 25 minutes; season to taste.'] },
    { id: 'tofu-stirfry', name: 'Tofu Veggie Stir-fry', slot: 'dinner', min: 25, kcal: 430, p: 24, c: 45, f: 16, cost: 1, art: ['rice', 'tofu', 'broccoli', 'pepper', 'carrot'],
      ing: [['Firm tofu', '5 oz'], ['Broccoli', '1 cup'], ['Bell pepper', '½'], ['Cooked rice', '¾ cup'], ['Low-sodium soy sauce', '1 tbsp']],
      steps: ['Press and cube tofu; sear until golden.', 'Stir-fry vegetables 4–5 minutes.', 'Toss everything with soy sauce; serve over rice.'] },
    { id: 'shrimp-tacos', name: 'Shrimp Tacos', slot: 'dinner', min: 20, kcal: 440, p: 30, c: 42, f: 15, cost: 3, art: ['wrap', 'shrimp', 'cabbage', 'avocado', 'tomato'],
      ing: [['Shrimp', '5 oz'], ['Corn tortillas', '3'], ['Shredded cabbage', '1 cup'], ['Lime', '1'], ['Avocado', '¼']],
      steps: ['Season shrimp with chili and lime; sear 2 min per side.', 'Warm tortillas.', 'Fill with cabbage, shrimp and avocado.'] },
    { id: 'lentil-soup', name: 'Hearty Lentil Soup', slot: 'dinner', min: 45, kcal: 360, p: 20, c: 52, f: 7, cost: 1, art: ['lentil', 'carrot', 'greens', 'tomato'],
      ing: [['Dry lentils', '⅓ cup'], ['Carrot', '1'], ['Celery', '1 stalk'], ['Onion', '½'], ['Diced tomatoes', '½ cup'], ['Broth', '2 cups']],
      steps: ['Sauté onion, carrot and celery 5 minutes.', 'Add lentils, tomatoes and broth.', 'Simmer 30 minutes until lentils are tender.'] },
    { id: 'steak-potato', name: 'Steak & Sweet Potato', slot: 'dinner', min: 35, kcal: 560, p: 42, c: 45, f: 20, cost: 3, art: ['beef', 'potato', 'broccoli'],
      ing: [['Sirloin steak', '5 oz'], ['Sweet potato', '1 medium'], ['Green beans', '1 cup']],
      steps: ['Roast cubed sweet potato at 425°F for 25 minutes.', 'Sear steak 3–4 min per side; rest 5 minutes.', 'Steam green beans and plate together.'] },
    { id: 'rice-beans', name: 'Budget Rice & Beans Bowl', slot: 'lunch', min: 20, kcal: 450, p: 17, c: 78, f: 8, cost: 1, art: ['rice', 'beans', 'tomato', 'greens', 'avocado'],
      ing: [['Cooked rice', '1 cup'], ['Black beans', '½ cup'], ['Salsa', '¼ cup'], ['Onion', '2 tbsp'], ['Cilantro', 'handful']],
      steps: ['Warm beans with cumin and garlic.', 'Spoon over rice.', 'Top with salsa, onion and cilantro.'] },
    { id: 'pasta-primavera', name: 'Pasta Primavera', slot: 'dinner', min: 25, kcal: 490, p: 18, c: 70, f: 15, cost: 1, art: ['pasta', 'tomato', 'cucumber', 'feta'],
      ing: [['Whole-wheat pasta', '2 oz dry'], ['Zucchini', '½'], ['Cherry tomatoes', '½ cup'], ['Parmesan', '2 tbsp'], ['Olive oil', '2 tsp']],
      steps: ['Cook pasta until al dente.', 'Sauté zucchini and tomatoes in olive oil.', 'Toss with pasta and parmesan.'] },
    { id: 'yogurt-parfait', name: 'Greek Yogurt Parfait', slot: 'snack', min: 5, kcal: 260, p: 20, c: 30, f: 6, cost: 1, art: ['yogurt', 'berries', 'oats'],
      ing: [['Greek yogurt', '¾ cup'], ['Berries', '½ cup'], ['Granola', '2 tbsp'], ['Honey', '1 tsp']],
      steps: ['Layer yogurt, berries and granola.', 'Drizzle with honey.'] },
    { id: 'hummus-plate', name: 'Hummus & Veggie Plate', slot: 'snack', min: 5, kcal: 240, p: 8, c: 24, f: 13, cost: 1, art: ['hummus', 'carrot', 'cucumber', 'pepper'],
      ing: [['Hummus', '¼ cup'], ['Carrot sticks', '½ cup'], ['Cucumber', '½'], ['Bell pepper', '½']],
      steps: ['Slice the vegetables.', 'Serve with hummus.'] },
    { id: 'pb-smoothie', name: 'Banana PB Smoothie', slot: 'snack', min: 5, kcal: 340, p: 22, c: 40, f: 11, cost: 1, art: ['banana', 'yogurt', 'oats'],
      ing: [['Banana', '1'], ['Peanut butter', '1 tbsp'], ['Milk', '1 cup'], ['Greek yogurt', '⅓ cup'], ['Ice', 'handful']],
      steps: ['Blend everything until smooth.'] }
  ];

  const coach = {
    guide: { name: 'The Guide', lines: ['your wellness journey is built one step at a time. Let\'s find a rhythm that works for you.', 'small, steady choices add up. What feels right today?'] },
    motivator: { name: 'The Motivator', lines: ['you\'ve got this! Let\'s make some progress today.', 'let\'s go! One more win on the board today.'] },
    strategist: { name: 'The Strategist', lines: ['here\'s the plan. Focus on one achievable action today.', 'check your numbers, pick your next move, execute.'] },
    companion: { name: 'The Companion', lines: ['it\'s good to have you here. Let\'s take care of you today.', 'however today goes, I\'m in your corner.'] }
  };

  return { equipment, exercises, focusNames, sessionTemplates, goals, recipes, coach };
})();
