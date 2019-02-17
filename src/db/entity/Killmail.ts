import {Entity, PrimaryColumn, Column, OneToOne} from "typeorm";
import { KmAuthinfo } from "./KmAuthinfo";

@Entity()
export class Killmail {
    @PrimaryColumn()
    id: number;

    @Column("jsonb")
    apiData: any

    @OneToOne(type => KmAuthinfo)
    kmAuthinfo: KmAuthinfo;
}
