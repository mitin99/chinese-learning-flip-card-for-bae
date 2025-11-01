import 'dotenv/config';
import { DataSource } from 'typeorm';
import { seedCards } from './seeds';
import { Card } from '../cards/card.entity';
import { User } from '../users/user.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Card],
  synchronize: true, // Enable to create tables if they don't exist
});

async function runSeeds() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('ERROR: DATABASE_URL is not set in .env file');
      console.error('Please check your backend/.env file');
      process.exit(1);
    }
    
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('Database connection established');

    await seedCards(dataSource);

    await dataSource.destroy();
    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

runSeeds();

