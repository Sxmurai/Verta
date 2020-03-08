import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("Tags")
export class Tags {
  @PrimaryGeneratedColumn()
  rowid!: number;

  @Column({ type: "varchar", length: 22 })
  guild!: string;

  @Column({ type: "text" })
  createdBy!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", length: 2000 })
  content!: string;

  @Column({ type: "date" })
  createdAt!: Date;

  @Column({ type: "date" })
  modifiedAt!: Date;

  @Column({ type: "text" })
  modifiedBy!: string;
}
