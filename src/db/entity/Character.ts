import {Entity, PrimaryColumn, OneToMany, Column} from "typeorm";
import { killmailAttacker } from "./killmailAttacker";

@Entity()
export class Character {
    @PrimaryColumn()
    id: number;

    @OneToMany(type => killmailAttacker, killmailAttacker => killmailAttacker.character)
    killmailAttackers: killmailAttacker[];

    @Column("varchar", { length: 200 })
    name:string
}
