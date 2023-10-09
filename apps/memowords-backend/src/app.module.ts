import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordModule } from './word/word.module';
import { ormConfig } from './ormconfig';
import { LearningModule } from './learning/learning.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    // In production, the frontend is served by the backend
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'public'),
    }),
    // ConfigModule loads the configuration from the .env file
    ConfigModule.forRoot({
      load: [configuration],
    }),
    // TypeOrmModule loads the database configuration from the ormconfig.ts file
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...ormConfig,
        entities: [],
        autoLoadEntities: true,
      }),
    }),
    UserModule,
    AuthModule,
    WordModule,
    LearningModule,
  ],
})
export class AppModule {}
