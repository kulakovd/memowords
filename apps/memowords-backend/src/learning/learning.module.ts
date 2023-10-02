import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { WordModule } from '../word/word.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningEntity } from './learning.entity';

@Module({
  imports: [WordModule, TypeOrmModule.forFeature([LearningEntity])],
  providers: [LearningService],
  controllers: [LearningController],
})
export class LearningModule {}
