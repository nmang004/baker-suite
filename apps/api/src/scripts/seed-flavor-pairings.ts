import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FlavorPairingData {
  ingredient1: string;
  ingredient2: string;
  confidence: number;
  compounds: string[];
  cuisine: string[];
  category: string;
}

const flavorPairings: FlavorPairingData[] = [
  // Essential Pairings (high confidence 0.8-1.0)
  {
    ingredient1: 'chocolate',
    ingredient2: 'vanilla',
    confidence: 0.95,
    compounds: ['vanillin', 'pyrazines', 'phenethylamine'],
    cuisine: ['french', 'american', 'italian'],
    category: 'sweet',
  },
  {
    ingredient1: 'cinnamon',
    ingredient2: 'apple',
    confidence: 0.92,
    compounds: ['cinnamaldehyde', 'esters', 'terpenes'],
    cuisine: ['american', 'french', 'nordic'],
    category: 'sweet',
  },
  {
    ingredient1: 'lemon',
    ingredient2: 'blueberry',
    confidence: 0.88,
    compounds: ['limonene', 'anthocyanins', 'citral'],
    cuisine: ['american', 'french'],
    category: 'sweet',
  },
  {
    ingredient1: 'almond',
    ingredient2: 'cherry',
    confidence: 0.90,
    compounds: ['benzaldehyde', 'esters', 'lactones'],
    cuisine: ['french', 'italian'],
    category: 'sweet',
  },
  {
    ingredient1: 'cardamom',
    ingredient2: 'orange',
    confidence: 0.85,
    compounds: ['terpenes', 'limonene', 'cineole'],
    cuisine: ['middle eastern', 'indian', 'nordic'],
    category: 'sweet',
  },
  {
    ingredient1: 'ginger',
    ingredient2: 'molasses',
    confidence: 0.87,
    compounds: ['gingerol', 'melanoidins', 'shogaol'],
    cuisine: ['american', 'british'],
    category: 'sweet',
  },
  {
    ingredient1: 'honey',
    ingredient2: 'lavender',
    confidence: 0.83,
    compounds: ['terpenes', 'esters', 'linalool'],
    cuisine: ['french', 'mediterranean'],
    category: 'sweet',
  },
  {
    ingredient1: 'coffee',
    ingredient2: 'chocolate',
    confidence: 0.94,
    compounds: ['caffeine', 'pyrazines', 'melanoidins'],
    cuisine: ['french', 'italian', 'american'],
    category: 'sweet',
  },
  {
    ingredient1: 'peanut butter',
    ingredient2: 'chocolate',
    confidence: 0.91,
    compounds: ['pyrazines', 'aldehydes', 'phenols'],
    cuisine: ['american'],
    category: 'sweet',
  },
  {
    ingredient1: 'cinnamon',
    ingredient2: 'sugar',
    confidence: 0.96,
    compounds: ['cinnamaldehyde', 'caramel', 'vanillin'],
    cuisine: ['american', 'french', 'mexican'],
    category: 'sweet',
  },

  // Complementary Pairings (medium confidence 0.5-0.8)
  {
    ingredient1: 'rosemary',
    ingredient2: 'lemon',
    confidence: 0.75,
    compounds: ['terpenes', 'limonene', 'pinene'],
    cuisine: ['mediterranean', 'italian'],
    category: 'savory',
  },
  {
    ingredient1: 'thyme',
    ingredient2: 'honey',
    confidence: 0.72,
    compounds: ['thymol', 'terpenes', 'esters'],
    cuisine: ['mediterranean', 'french'],
    category: 'sweet',
  },
  {
    ingredient1: 'black pepper',
    ingredient2: 'strawberry',
    confidence: 0.68,
    compounds: ['piperine', 'esters', 'terpenes'],
    cuisine: ['french', 'modern'],
    category: 'sweet',
  },
  {
    ingredient1: 'olive oil',
    ingredient2: 'orange',
    confidence: 0.70,
    compounds: ['limonene', 'oleic acid', 'terpenes'],
    cuisine: ['mediterranean', 'italian'],
    category: 'savory',
  },
  {
    ingredient1: 'sea salt',
    ingredient2: 'caramel',
    confidence: 0.89,
    compounds: ['sodium chloride', 'melanoidins', 'diacetyl'],
    cuisine: ['french', 'american'],
    category: 'sweet',
  },
  {
    ingredient1: 'earl grey',
    ingredient2: 'vanilla',
    confidence: 0.76,
    compounds: ['bergaptene', 'vanillin', 'linalool'],
    cuisine: ['british', 'french'],
    category: 'sweet',
  },
  {
    ingredient1: 'coconut',
    ingredient2: 'lime',
    confidence: 0.78,
    compounds: ['limonene', 'lactones', 'terpenes'],
    cuisine: ['asian', 'tropical'],
    category: 'sweet',
  },
  {
    ingredient1: 'pistachio',
    ingredient2: 'rose',
    confidence: 0.74,
    compounds: ['terpenes', 'geraniol', 'phenylethanol'],
    cuisine: ['middle eastern', 'persian'],
    category: 'sweet',
  },
  {
    ingredient1: 'hazelnut',
    ingredient2: 'coffee',
    confidence: 0.82,
    compounds: ['pyrazines', 'phenols', 'aldehydes'],
    cuisine: ['french', 'italian'],
    category: 'sweet',
  },
  {
    ingredient1: 'brown butter',
    ingredient2: 'sage',
    confidence: 0.73,
    compounds: ['diacetyl', 'lactones', 'terpenes'],
    cuisine: ['french', 'italian'],
    category: 'savory',
  },

  // Experimental Pairings (lower confidence 0.3-0.5)
  {
    ingredient1: 'miso',
    ingredient2: 'caramel',
    confidence: 0.48,
    compounds: ['umami compounds', 'melanoidins', 'glutamates'],
    cuisine: ['asian fusion', 'modern'],
    category: 'sweet',
  },
  {
    ingredient1: 'tahini',
    ingredient2: 'chocolate',
    confidence: 0.52,
    compounds: ['pyrazines', 'phenols', 'sesame compounds'],
    cuisine: ['middle eastern', 'modern'],
    category: 'sweet',
  },
  {
    ingredient1: 'balsamic',
    ingredient2: 'strawberry',
    confidence: 0.65,
    compounds: ['acetic acid', 'esters', 'terpenes'],
    cuisine: ['italian', 'modern'],
    category: 'sweet',
  },
  {
    ingredient1: 'basil',
    ingredient2: 'strawberry',
    confidence: 0.58,
    compounds: ['linalool', 'esters', 'terpenes'],
    cuisine: ['italian', 'modern'],
    category: 'sweet',
  },
  {
    ingredient1: 'black sesame',
    ingredient2: 'honey',
    confidence: 0.62,
    compounds: ['sesamol', 'esters', 'terpenes'],
    cuisine: ['asian', 'japanese'],
    category: 'sweet',
  },
  {
    ingredient1: 'matcha',
    ingredient2: 'white chocolate',
    confidence: 0.72,
    compounds: ['catechins', 'vanillin', 'theobromine'],
    cuisine: ['japanese', 'modern'],
    category: 'sweet',
  },

  // Additional classic pairings
  {
    ingredient1: 'pear',
    ingredient2: 'cardamom',
    confidence: 0.79,
    compounds: ['esters', 'terpenes', 'cineole'],
    cuisine: ['nordic', 'french'],
    category: 'sweet',
  },
  {
    ingredient1: 'walnut',
    ingredient2: 'maple',
    confidence: 0.84,
    compounds: ['tannins', 'vanillin', 'phenols'],
    cuisine: ['american', 'canadian'],
    category: 'sweet',
  },
  {
    ingredient1: 'orange',
    ingredient2: 'chocolate',
    confidence: 0.88,
    compounds: ['limonene', 'pyrazines', 'terpenes'],
    cuisine: ['french', 'british'],
    category: 'sweet',
  },
  {
    ingredient1: 'raspberry',
    ingredient2: 'rose',
    confidence: 0.76,
    compounds: ['esters', 'geraniol', 'phenylethanol'],
    cuisine: ['french', 'middle eastern'],
    category: 'sweet',
  },
  {
    ingredient1: 'banana',
    ingredient2: 'caramel',
    confidence: 0.81,
    compounds: ['isoamyl acetate', 'melanoidins', 'esters'],
    cuisine: ['american', 'french'],
    category: 'sweet',
  },
  {
    ingredient1: 'pecan',
    ingredient2: 'brown sugar',
    confidence: 0.86,
    compounds: ['tannins', 'melanoidins', 'caramel'],
    cuisine: ['american', 'southern'],
    category: 'sweet',
  },
  {
    ingredient1: 'fig',
    ingredient2: 'goat cheese',
    confidence: 0.67,
    compounds: ['anthocyanins', 'fatty acids', 'lactones'],
    cuisine: ['mediterranean', 'french'],
    category: 'savory',
  },
  {
    ingredient1: 'apricot',
    ingredient2: 'almond',
    confidence: 0.83,
    compounds: ['benzaldehyde', 'lactones', 'esters'],
    cuisine: ['french', 'mediterranean'],
    category: 'sweet',
  },
  {
    ingredient1: 'cranberry',
    ingredient2: 'orange',
    confidence: 0.80,
    compounds: ['anthocyanins', 'limonene', 'esters'],
    cuisine: ['american', 'british'],
    category: 'sweet',
  },
  {
    ingredient1: 'nutmeg',
    ingredient2: 'cream',
    confidence: 0.77,
    compounds: ['myristicin', 'lactones', 'terpenes'],
    cuisine: ['french', 'british'],
    category: 'sweet',
  },
  {
    ingredient1: 'elderflower',
    ingredient2: 'lemon',
    confidence: 0.71,
    compounds: ['terpenes', 'limonene', 'linalool'],
    cuisine: ['british', 'scandinavian'],
    category: 'sweet',
  },
  {
    ingredient1: 'chai spice',
    ingredient2: 'apple',
    confidence: 0.79,
    compounds: ['cinnamaldehyde', 'cardamom compounds', 'esters'],
    cuisine: ['indian', 'american'],
    category: 'sweet',
  },
];

async function seedFlavorPairings() {
  console.log('Starting flavor pairing seeding...');

  try {
    // Clear existing pairings
    await prisma.flavorPairing.deleteMany();
    console.log('Cleared existing flavor pairings');

    // Create pairings
    let created = 0;
    for (const pairing of flavorPairings) {
      await prisma.flavorPairing.create({
        data: {
          ingredient1: pairing.ingredient1.toLowerCase(),
          ingredient2: pairing.ingredient2.toLowerCase(),
          confidence: pairing.confidence,
          compounds: pairing.compounds,
          cuisine: pairing.cuisine,
          category: pairing.category,
        },
      });
      created++;

      if (created % 10 === 0) {
        console.log(`Created ${created} pairings...`);
      }
    }

    console.log(`\nSuccessfully seeded ${created} flavor pairings!`);
    console.log(`\nBreakdown by confidence:`);

    const highConfidence = flavorPairings.filter(p => p.confidence >= 0.8).length;
    const mediumConfidence = flavorPairings.filter(p => p.confidence >= 0.5 && p.confidence < 0.8).length;
    const experimental = flavorPairings.filter(p => p.confidence < 0.5).length;

    console.log(`- High confidence (0.8-1.0): ${highConfidence} pairings`);
    console.log(`- Medium confidence (0.5-0.8): ${mediumConfidence} pairings`);
    console.log(`- Experimental (0.3-0.5): ${experimental} pairings`);

    // Count unique ingredients
    const ingredients = new Set<string>();
    flavorPairings.forEach(p => {
      ingredients.add(p.ingredient1);
      ingredients.add(p.ingredient2);
    });
    console.log(`\nUnique ingredients: ${ingredients.size}`);

    // Count by category
    const sweet = flavorPairings.filter(p => p.category === 'sweet').length;
    const savory = flavorPairings.filter(p => p.category === 'savory').length;
    console.log(`\nBy category:`);
    console.log(`- Sweet: ${sweet}`);
    console.log(`- Savory: ${savory}`);
  } catch (error) {
    console.error('Error seeding flavor pairings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedFlavorPairings()
  .then(() => {
    console.log('\nSeeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
