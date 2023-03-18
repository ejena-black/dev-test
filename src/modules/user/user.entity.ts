import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  firstName: string;

  @Column({
    type: 'varchar',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column()
  role: string;

  // @OneToOne(() => Wallet)
  // @JoinColumn()
  // wallet: Wallet;
}
