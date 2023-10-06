import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LearningService } from './learning.service';
import { Answer } from '../domain/answer';
import { Request } from 'express';

@Controller('api/learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get('next-question')
  getQuestions(@Req() req: Request) {
    return this.learningService.nextQuestion(req.userId);
  }

  @Post('answer')
  answer(@Body() answer: Answer, @Req() req: Request) {
    return this.learningService.reviewLearning(answer, req.userId);
  }
}
