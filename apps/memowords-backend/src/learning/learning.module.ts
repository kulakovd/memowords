import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { WordModule } from '../word/word.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningEntity } from './learning.entity';

/**
 * Learning module that contains all the logic related to the learning process.
 */
@Module({
  imports: [WordModule, TypeOrmModule.forFeature([LearningEntity])],
  providers: [LearningService],
  controllers: [LearningController],
})
export class LearningModule {}
