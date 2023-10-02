import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LearningService } from './learning.service';
import { Answer } from '../domain/answer';
import { Request } from 'express';

@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get('next-question')
  getQuestions() {
    return this.learningService.nextQuestion();
  }

  @Post('answer')
  answer(@Body() answer: Answer, @Req() req: Request) {
    return this.learningService.reviewLearning(answer, req.userId);
  }
}