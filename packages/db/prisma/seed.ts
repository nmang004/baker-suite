import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

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

  console.log('✅ Seed completed successfully!');
  console.log(`   - Created ${flavorPairings.length} flavor pairings`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
