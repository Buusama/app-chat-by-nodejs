import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBookmarksTable1701443372363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bookmarks',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'sender_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'receiver_id',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bookmarks');
  }
}
