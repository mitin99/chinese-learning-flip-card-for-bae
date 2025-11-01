import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chinese: string;

  @Column({ nullable: true })
  pinyin: string;

  @Column()
  vietnamese: string;

  @Column('text', { array: true, default: [] })
  categories: string[];

  @Column({ nullable: true })
  authorId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ default: false })
  isSystemCard: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

