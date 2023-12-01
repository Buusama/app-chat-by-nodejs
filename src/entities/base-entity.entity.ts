import { Column, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @Column({ nullable: false })
  created_user_id: number;

  @Column({ nullable: true })
  updated_user_id: number;

  @Column()
  created_at: Date;

  @UpdateDateColumn({ nullable: false })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_user_id: number;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
