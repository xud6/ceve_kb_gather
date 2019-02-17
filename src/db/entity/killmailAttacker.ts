import {Entity, PrimaryColumn, ManyToOne} from "typeorm";
import { Killmail } from "./Killmail";

@Entity()
export class killmailAttacker {
    @PrimaryColumn()
    id: number;

    @ManyToOne(type => Killmail, killmail => killmail.killmailAttackers)
    killmail: Killmail;
}
