import {
  Column,
  PrimaryGeneratedColumn,
  Index,
  BaseEntity,
  Entity
} from "typeorm";
import { Snowflake } from "discord.js";

@Entity("infractions")
export class Infractions extends BaseEntity {
  @PrimaryGeneratedColumn()
  rowid!: number;
  @Column()
  caseID!: number;

  @Column({ type: "varchar", length: 22 })
  guild!: string;

  @Index()
  @Column()
  target!: string;

  @Index()
  @Column()
  moderator!: string;

  @Column({ type: "date" })
  warnedAt!: Date;

  @Column()
  reason!: string;

  @Column()
  type!: string;
}
