import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('friends')
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sender_id: number;

    @Column()
    receiver_id: number;

    @Column()
    status: string;
}
