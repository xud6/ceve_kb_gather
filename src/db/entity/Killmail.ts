import { Entity, PrimaryColumn, Column, OneToOne, ManyToOne, OneToMany } from "typeorm";
import { KmAuthinfo } from "./KmAuthinfo";
import { War } from "./War";
import { SolarSystem } from "./SolarSystem";
import { killmailAttacker } from "./killmailAttacker";

@Entity()
export class Killmail {
    @PrimaryColumn()
    id: number;

    @Column("jsonb")
    apiData: any

    @OneToOne(type => KmAuthinfo)
    kmAuthinfo: KmAuthinfo;

    @ManyToOne(type => War, war => war.killmails)
    war: War;

    @ManyToOne(type => SolarSystem, solarSystem => solarSystem.killmails)
    solarSystem: War;

    @OneToMany(type => killmailAttacker, killmailAttacker => killmailAttacker.killmail)
    killmailAttackers: killmailAttacker[];
}
