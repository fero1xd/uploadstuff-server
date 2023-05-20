import { Status } from 'src/types';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'stuff' })
export class Stuff {
  @Column({ type: 'text' })
  metadata: string;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ primary: true })
  fileKey: string;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column()
  callbackUrl: string;

  @Column()
  callbackSlug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
