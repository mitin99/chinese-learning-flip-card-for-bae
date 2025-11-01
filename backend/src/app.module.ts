import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Card } from './cards/card.entity';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Card],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync schema in dev
      logging: process.env.NODE_ENV === 'development',
    }),
    UsersModule,
    CardsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
