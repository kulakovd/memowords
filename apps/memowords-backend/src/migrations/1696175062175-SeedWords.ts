import { MigrationInterface, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';
import * as parsedWords from './words.json';

/**
 * Migration that seeds the database with words.
 * The words are taken from the words.json file.
 */
export class SeedWords1696175062175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const logger = new Logger('SeedWords');

    logger.log(`words from json: ${parsedWords.length}`);

    const processedWords = parsedWords.flatMap((word) => {
      const { en, ru, tr } = word;
      // Data requires some processing and cleaning
      return ru
        .replace(/[(*]+.*?[)*]+/g, '')
        .replaceAll('(', '')
        .trim()
        .split(/[,;]/g)
        .map((r) => r.trim())
        .map((r) => ({
          en,
          ru: r,
          tr,
        }));
    });

    logger.log(`processed words: ${processedWords.length}`);

    const valuePlaceholders = processedWords
      .map(
        (_, index) =>
          `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`,
      )
      .join(', ');

    const prevLogger = queryRunner.connection.logger;
    queryRunner.connection.logger = {
      logQuery: () => {},
      logQueryError: () => {},
      logQuerySlow: () => {},
      logSchemaBuild: () => {},
      logMigration: () => {},
      log: () => {},
    };

    await queryRunner.query(
      `INSERT INTO word_entity (english, russian, transcription) VALUES ${valuePlaceholders}`,
      processedWords.flatMap((word) => [word.en, word.ru, word.tr]),
    );

    queryRunner.connection.logger = prevLogger;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`DELETE FROM word_entity`);
  }
}
