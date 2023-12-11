import { Column, PrimaryGeneratedColumn, Entity, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('bookmarks')
export class Bookmark {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    sender_id: number;

    @Column({ type: 'int' })
    receiver_id: number;
    
    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'sender_id' })
    receiver: User;
}
