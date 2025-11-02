import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { seedCards } from '../database/seeds';

@Injectable()
export class AdminService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async seedDatabase() {
    try {
      await seedCards(this.dataSource);
      return {
        success: true,
        message: 'Database seeded successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to seed database',
        error: error.message,
      };
    }
  }
}

