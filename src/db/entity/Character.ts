import {Entity, PrimaryColumn, OneToMany} from "typeorm";
import { killmailAttacker } from "./killmailAttacker";

@Entity()
export class Character {
    @PrimaryColumn()
    id: number;

    @OneToMany(type => killmailAttacker, killmailAttacker => killmailAttacker.character)
    killmailAttackers: killmailAttacker[];
}
