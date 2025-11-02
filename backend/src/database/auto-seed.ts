import { DataSource } from 'typeorm';
import { Card } from '../cards/card.entity';
import { seedCards } from './seeds';

export async function autoSeed(dataSource: DataSource) {
  try {
    // Check if database is already seeded
    const cardRepository = dataSource.getRepository(Card);
    const cardCount = await cardRepository.count({
      where: { isSystemCard: true },
    });

    if (cardCount === 0) {
      console.log('No system cards found. Auto-seeding database...');
      await seedCards(dataSource);
      console.log('Auto-seeding completed!');
    } else {
      console.log(
        `Database already has ${cardCount} system cards. Skipping auto-seed.`,
      );
    }
  } catch (error) {
    console.error('Auto-seed error (non-fatal):', error);
    // Don't throw - let the app start even if seeding fails
  }
}
