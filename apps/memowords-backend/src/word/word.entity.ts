import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Word } from '../domain/word';

@Entity()
export class WordEntity implements Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  english: string;

  @Column()
  russian: string;

  @Column({ nullable: true })
  transcription?: string;
}
