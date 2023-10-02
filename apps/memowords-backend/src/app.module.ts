import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordModule } from './word/word.module';
import { ormConfig } from './ormconfig';
import { LearningModule } from './learning/learning.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...ormConfig,
        entities: [],
        autoLoadEntities: true,
      }),
    }),
    WordModule,
    LearningModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
