import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity("Level")
export class Level {
  @PrimaryGeneratedColumn()
  rowid!: number;

  @Column({ type: "varchar", length: "22" })
  guild!: string;

  @Column()
  user!: string;

  @Column()
  xp!: number;

  @Column()
  level!: number;
}
