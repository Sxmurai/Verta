import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("Economy")
export class Economy {
  @PrimaryGeneratedColumn()
  rowid!: number;

  @Column({ type: "varchar", length: 22 })
  guild!: string;

  @Column({ type: "text" })
  user!: string;

  @Column({ type: "integer", nullable: true, default: 0 })
  pocket!: number;

  @Column({ type: "integer", nullable: true, default: 0 })
  bank!: number;

  @Column({ type: "text", length: 1000, default: "A cool user." })
  description!: string;

  @Column({ type: "integer", nullable: true, default: 0 })
  reputation!: number;
}
