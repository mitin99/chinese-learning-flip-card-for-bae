import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  async findAll(category?: string): Promise<Card[]> {
    const query = this.cardsRepository.createQueryBuilder('card');

    if (category) {
      query.where('card.categories && ARRAY[:category]', { category });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.cardsRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  async create(createCardDto: CreateCardDto, user: User): Promise<Card> {
    const card = this.cardsRepository.create({
      ...createCardDto,
      authorId: user.id,
      categories: createCardDto.categories || [],
    });

    return this.cardsRepository.save(card);
  }

  async update(id: string, updateCardDto: UpdateCardDto, user: User): Promise<Card> {
    const card = await this.findOne(id);

    // Only allow admin to update any card, or user to update their own cards
    if (user.role !== 'admin' && card.authorId !== user.id) {
      throw new ForbiddenException('You can only update your own cards');
    }

    Object.assign(card, updateCardDto);
    return this.cardsRepository.save(card);
  }

  async remove(id: string, user: User): Promise<void> {
    const card = await this.findOne(id);

    // Only allow admin to delete any card, or user to delete their own cards
    if (user.role !== 'admin' && card.authorId !== user.id) {
      throw new ForbiddenException('You can only delete your own cards');
    }

    await this.cardsRepository.remove(card);
  }
}
