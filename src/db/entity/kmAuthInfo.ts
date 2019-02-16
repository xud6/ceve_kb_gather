import {Entity, PrimaryColumn, Column, OneToOne, JoinColumn} from "typeorm";
import { km } from "./km";

@Entity()
export class kmAuthInfo {
    @PrimaryColumn()
    id: number;

    @Column("varchar", { length: 100 })
    hash: string

    @OneToOne(type => km)
    @JoinColumn()
    km: km;
}
