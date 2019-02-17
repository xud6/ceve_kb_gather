import {Entity, PrimaryColumn, Column, OneToOne} from "typeorm";
import { kmAuthInfo } from "./kmAuthInfo";

@Entity()
export class Killmail {
    @PrimaryColumn()
    id: number;

    @Column("jsonb")
    apiData: any

    @OneToOne(type => kmAuthInfo)
    kmInfo: kmAuthInfo;
}
