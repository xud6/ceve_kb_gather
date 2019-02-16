import { LoggerOptions } from "typeorm/logger/LoggerOptions";

export interface tDatabaseConfig {
    database: string,
    username: string,
    password: string,
    host: string,
    port: number,
    prefix?: string,
    logging: LoggerOptions
}

export interface tConfig {
    database:tDatabaseConfig
}