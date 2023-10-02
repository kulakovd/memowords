import { Learning } from '../domain/learning';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { WordEntity } from '../word/word.entity';
import { Word } from '../domain/word';
import { User } from '../domain/user';

@Entity()
export class LearningEntity implements Learning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => WordEntity, (word) => word.id)
  word: Word;

  @Column()
  wordId: string;

  @Column({ default: 1 })
  interval: number;

  @Column({ type: 'float', default: 2.5 })
  easinessFactor: number;

  @Column({ default: 0 })
  repetitions: number;

  @Column({ type: 'timestamp' })
  nextRepetition: Date = new Date();
}
