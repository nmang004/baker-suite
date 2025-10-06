import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@bakersuite.com' },
    update: {},
    create: {
      clerkId: 'test_user_clerk_id',
      email: 'test@bakersuite.com',
      firstName: 'Test',
      lastName: 'Baker',
      tier: 'FREE',
    },
  });

  console.log('[✓] Created test user:', testUser.email);

  // Create sample recipes
  const sourdoughRecipe = await prisma.recipe.upsert({
    where: { id: 'test_recipe_1' },
    update: {},
    create: {
      id: 'test_recipe_1',
      userId: testUser.id,
      name: 'Classic Sourdough Boule',
      description: 'A traditional 70% hydration sourdough with overnight fermentation',
      ingredients: [
        { name: 'Bread Flour', quantity: 500, unit: 'g', percentage: 100 },
        { name: 'Water', quantity: 350, unit: 'g', percentage: 70 },
        { name: 'Salt', quantity: 10, unit: 'g', percentage: 2 },
        { name: 'Sourdough Starter', quantity: 100, unit: 'g', percentage: 20 },
      ],
      instructions: [
        'Mix flour and water, autolyse for 30 minutes',
        'Add starter and salt, mix well',
        'Bulk fermentation 4-5 hours with stretch and folds every 30 min',
        'Shape and cold proof overnight (12-14 hours)',
        'Score and bake at 450°F for 45 minutes',
      ],
      tags: ['sourdough', 'bread', 'overnight'],
      ratios: {
        flour: 100,
        water: 70,
        salt: 2,
        starter: 20,
        hydration: 70,
      },
    },
  });

  const focacciaRecipe = await prisma.recipe.upsert({
    where: { id: 'test_recipe_2' },
    update: {},
    create: {
      id: 'test_recipe_2',
      userId: testUser.id,
      name: 'Rosemary Focaccia',
      description: 'High hydration focaccia with rosemary and sea salt',
      ingredients: [
        { name: 'All-Purpose Flour', quantity: 400, unit: 'g', percentage: 100 },
        { name: 'Water', quantity: 320, unit: 'g', percentage: 80 },
        { name: 'Salt', quantity: 8, unit: 'g', percentage: 2 },
        { name: 'Instant Yeast', quantity: 3, unit: 'g', percentage: 0.75 },
        { name: 'Olive Oil', quantity: 40, unit: 'g', percentage: 10 },
      ],
      instructions: [
        'Mix all ingredients until just combined',
        'Bulk fermentation 2 hours with 3 folds',
        'Transfer to oiled pan and dimple',
        'Final proof 1 hour',
        'Top with rosemary and sea salt',
        'Bake at 425°F for 25-30 minutes',
      ],
      tags: ['focaccia', 'italian', 'quick'],
      ratios: {
        flour: 100,
        water: 80,
        salt: 2,
        yeast: 0.75,
        hydration: 80,
      },
    },
  });

  console.log('[✓] Created sample recipes');

  // Create a sample starter
  const testStarter = await prisma.starter.upsert({
    where: { id: 'test_starter_1' },
    update: {},
    create: {
      id: 'test_starter_1',
      userId: testUser.id,
      name: 'Rye Sourdough Starter',
      flourType: 'Whole Rye',
      createdDate: new Date('2024-01-01'),
      feedingRatio: '1:1:1',
      lastFed: new Date(),
      health: 5,
      notes: 'Very active starter, feeds once daily',
    },
  });

  console.log('[✓] Created sample starter');

  // Seed flavor pairings
  const flavorPairings = [
    {
      ingredient1: 'chocolate',
      ingredient2: 'orange',
      confidence: 0.92,
      compounds: ['limonene', 'linalool'],
      cuisine: ['french', 'italian'],
      category: 'sweet',
    },
    {
      ingredient1: 'rosemary',
      ingredient2: 'lemon',
      confidence: 0.88,
      compounds: ['pinene', 'limonene'],
      cuisine: ['mediterranean', 'italian'],
      category: 'savory',
    },
    {
      ingredient1: 'cinnamon',
      ingredient2: 'apple',
      confidence: 0.95,
      compounds: ['cinnamaldehyde', 'eugenol'],
      cuisine: ['american', 'european'],
      category: 'sweet',
    },
    {
      ingredient1: 'garlic',
      ingredient2: 'olive oil',
      confidence: 0.98,
      compounds: ['allicin', 'oleic acid'],
      cuisine: ['mediterranean', 'italian', 'greek'],
      category: 'savory',
    },
  ];

  for (const pairing of flavorPairings) {
    await prisma.flavorPairing.upsert({
      where: {
        ingredient1_ingredient2: {
          ingredient1: pairing.ingredient1,
          ingredient2: pairing.ingredient2,
        },
      },
      update: {},
      create: pairing,
    });
  }

  console.log('[✓] Seed completed successfully!');
  console.log('   - Created 1 test user');
  console.log('   - Created 2 sample recipes');
  console.log('   - Created 1 sample starter');
  console.log(`   - Created ${flavorPairings.length} flavor pairings`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('[✗] Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
