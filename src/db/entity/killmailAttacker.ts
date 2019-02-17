import {Entity, PrimaryColumn, ManyToOne} from "typeorm";
import { Killmail } from "./Killmail";
import { Character } from "./Character";

@Entity()
export class killmailAttacker {
    @PrimaryColumn()
    id: number;

    @ManyToOne(type => Killmail, killmail => killmail.killmailAttackers)
    killmail: Killmail;

    @ManyToOne(type => Character, character => character.killmailAttackers)
    character: Character;
}
