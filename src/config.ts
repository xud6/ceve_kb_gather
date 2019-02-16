import { tConfig } from "./types/config";

let tConfig: tConfig = {
    database: {
        database: 'dev_ceve_kb',
        username: 'dev_ceve_kb',
        password: 'm5948qv1f0d18s5xs16l',
        host: '10.8.32.195',
        port: 5432,
        logging: ["error", "schema", "warn", "info", "log"]
    },
}

export let config = tConfig