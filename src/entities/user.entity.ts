import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Bookmark } from './bookmark.entity';
import { Friend } from './friend.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  name: string;

  @Column()
  gender: string;

  @Column({ length: 255, nullable: true })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column()
  level: string;

  @Column({ length: 255, nullable: true })
  certificate: string;

  @Column({ length: 100, nullable: true })
  province: string;

  @Column()
  password: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column()
  nationality: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Bookmark, (bookmark) => bookmark.receiver)
  bookmarks: Bookmark[];

  @OneToMany(() => Friend, (friend) => friend.receiver)
  friends: Friend[];
}
