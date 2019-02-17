import {Entity, PrimaryColumn, OneToMany} from "typeorm";
import { Killmail } from "./Killmail";

@Entity()
export class War {
    @PrimaryColumn()
    id: number;

    @OneToMany(type => Killmail, killmail => killmail.war)
    killmails: Killmail[];
}
