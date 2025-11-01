import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    return this.cardsService.findAll(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCardDto: CreateCardDto, @Request() req) {
    return this.cardsService.create(createCardDto, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Request() req,
  ) {
    return this.cardsService.update(id, updateCardDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    await this.cardsService.remove(id, req.user);
    return { message: 'Card deleted successfully' };
  }
}
