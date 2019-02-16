import {Entity, PrimaryColumn, Column, OneToOne, JoinColumn} from "typeorm";
import { kmAuthInfo } from "./kmAuthInfo";

@Entity()
export class km {
    @PrimaryColumn()
    id: number;

    @Column("jsonb")
    apiData: any

    @OneToOne(type => kmAuthInfo)
    kmInfo: kmAuthInfo;
}
