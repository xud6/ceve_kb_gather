import {Entity, PrimaryColumn, OneToMany} from "typeorm";
import { Killmail } from "./Killmail";

@Entity()
export class SolarSystem {
    @PrimaryColumn()
    id: number;

    @OneToMany(type => Killmail, killmail => killmail.solarSystem)
    killmails: Killmail[];
}
