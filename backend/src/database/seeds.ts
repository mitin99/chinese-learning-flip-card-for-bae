import { DataSource } from 'typeorm';
import { Card } from '../cards/card.entity';

// Sample Chinese-Vietnamese vocabulary cards with Pinyin
const sampleCards = [
  {
    chinese: '你好',
    pinyin: 'nǐ hǎo',
    vietnamese: 'Xin chào',
    categories: ['Greetings'],
    isSystemCard: true,
  },
  {
    chinese: '谢谢',
    pinyin: 'xiè xie',
    vietnamese: 'Cảm ơn',
    categories: ['Greetings', 'Common'],
    isSystemCard: true,
  },
  {
    chinese: '再见',
    pinyin: 'zài jiàn',
    vietnamese: 'Tạm biệt',
    categories: ['Greetings'],
    isSystemCard: true,
  },
  {
    chinese: '是的',
    pinyin: 'shì de',
    vietnamese: 'Đúng / Vâng',
    categories: ['Common'],
    isSystemCard: true,
  },
  {
    chinese: '不是',
    pinyin: 'bù shì',
    vietnamese: 'Không',
    categories: ['Common'],
    isSystemCard: true,
  },
  {
    chinese: '请',
    pinyin: 'qǐng',
    vietnamese: 'Xin / Làm ơn',
    categories: ['Common'],
    isSystemCard: true,
  },
  {
    chinese: '对不起',
    pinyin: 'duì bu qǐ',
    vietnamese: 'Xin lỗi',
    categories: ['Common'],
    isSystemCard: true,
  },
  {
    chinese: '水',
    pinyin: 'shuǐ',
    vietnamese: 'Nước',
    categories: ['Food & Drink'],
    isSystemCard: true,
  },
  {
    chinese: '饭',
    pinyin: 'fàn',
    vietnamese: 'Cơm',
    categories: ['Food & Drink'],
    isSystemCard: true,
  },
  {
    chinese: '茶',
    pinyin: 'chá',
    vietnamese: 'Trà',
    categories: ['Food & Drink'],
    isSystemCard: true,
  },
  {
    chinese: '一',
    pinyin: 'yī',
    vietnamese: 'Một',
    categories: ['Numbers'],
    isSystemCard: true,
  },
  {
    chinese: '二',
    pinyin: 'èr',
    vietnamese: 'Hai',
    categories: ['Numbers'],
    isSystemCard: true,
  },
  {
    chinese: '三',
    pinyin: 'sān',
    vietnamese: 'Ba',
    categories: ['Numbers'],
    isSystemCard: true,
  },
  {
    chinese: '四',
    pinyin: 'sì',
    vietnamese: 'Bốn',
    categories: ['Numbers'],
    isSystemCard: true,
  },
  {
    chinese: '五',
    pinyin: 'wǔ',
    vietnamese: 'Năm',
    categories: ['Numbers'],
    isSystemCard: true,
  },
];

export async function seedCards(dataSource: DataSource) {
  const cardRepository = dataSource.getRepository(Card);

  // Check if cards already exist
  const existingCards = await cardRepository.find({ where: { isSystemCard: true } });
  
  if (existingCards.length > 0) {
    console.log(`Found ${existingCards.length} existing system cards. Updating with Pinyin...`);
    
    // Update existing cards with Pinyin from seed data
    for (const existingCard of existingCards) {
      const seedCard = sampleCards.find(sc => sc.chinese === existingCard.chinese);
      if (seedCard && !existingCard.pinyin) {
        existingCard.pinyin = seedCard.pinyin;
        await cardRepository.save(existingCard);
      }
    }
    
    // Check if we need to add any missing cards
    const existingChinese = existingCards.map(c => c.chinese);
    const missingCards = sampleCards.filter(sc => !existingChinese.includes(sc.chinese));
    
    if (missingCards.length > 0) {
      const newCards = cardRepository.create(missingCards);
      await cardRepository.save(newCards);
      console.log(`Added ${missingCards.length} new cards.`);
    }
    
    console.log('Seeding completed!');
    return;
  }

  // Create cards if none exist
  const cards = cardRepository.create(sampleCards);
  await cardRepository.save(cards);
  console.log(`Seeded ${cards.length} cards successfully!`);
}
