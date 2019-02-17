import {Entity, PrimaryColumn, Column, OneToOne, ManyToOne} from "typeorm";
import { KmAuthinfo } from "./KmAuthinfo";
import { War } from "./War";
import { SolarSystem } from "./SolarSystem";

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
}
