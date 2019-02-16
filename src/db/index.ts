import "reflect-metadata";
import { createConnection, Connection, ObjectType, Repository } from "typeorm";
import { v1 as uuidv1 } from 'uuid';
import { tDatabaseConfig } from "./../types/config";

export default async function connectdb(config: tDatabaseConfig, name?: string): Promise<Connection> {
    if (!name) {
        name = uuidv1();
    }
    return await createConnection({
        name: name,
        type: "postgres",
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [__dirname + "/entity/*{.js,.ts}"],
        entityPrefix: config.prefix,
        // cache: true,
        //entityPrefix: "test_",
        synchronize: true,
        logging: config.logging
    })
}

export class typeormdb {
    readonly getConnection: Promise<Connection>
    constructor(config: tDatabaseConfig) {
        this.getConnection = connectdb(config);
    }
    /**
     * safe to pass directly
     */
    readonly getRepository = async <T>(repo: ObjectType<T>): Promise<Repository<T>> => {
        let connection = await this.getConnection
        return await connection.getRepository(repo)
    }
    /**
     * safe to pass directly
     */
    readonly inited = (): Promise<Connection> => {
        return this.getConnection
    }
}