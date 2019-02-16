import { KbGather } from './KbGather'
import { typeormdb } from './db'
import { tConfig } from './types/config';

import { config } from './config'

class ceveKMGather {
    db: typeormdb
    KbGather: KbGather
    constructor(config: tConfig) {
        this.db = new typeormdb(config.database)
        this.KbGather = new KbGather({ db: this.db })
    }
    async init() {
        await this.db.inited;
        this.KbGather.loadKmInfo(10);
    }
}

let service = new ceveKMGather(config)
async function start() {
    await service.init()
}

start()