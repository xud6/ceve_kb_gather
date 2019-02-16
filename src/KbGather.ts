import got from 'got'
import parse5 from 'parse5'
import _ from 'lodash'
import { FindHTMLASTNode } from './HTMLAST';
import { format } from 'util';
import { typeormdb } from './db';
import { kmAuthInfo } from './db/entity/kmAuthInfo';

const kbBaseURL = "https://kb.ceve-market.org"
const esiKillmailsApi = "https://esi.evepc.163.com/latest/killmails"

let ta = [1, 2, 3, 4]
for (let t in ta) {

}

function findkbtable(node: any): boolean {
    if (node.tagName && (node.tagName == "table")) {
        if (_.isArray(node.attrs)) {
            for (let attr of node.attrs) {
                if ((attr.name == 'id') && (attr.value == 'kbtable')) {
                    return true;
                }
            }
        }
    }
    return false;
}

interface tKmInfo {
    id: number,
    hash: string
}

export class KbGather {
    constructor(readonly config:{
        db:typeormdb
    }) {

    }
    async checkAndInsertKmInfo(info:tKmInfo):Promise<boolean>{
        let repo = await this.config.db.getRepository(kmAuthInfo)
        let record = await repo.findOne({
            id:info.id
        })
        if(record){
            // console.log(`km ${kmInfo.id} already exist`)
            return false
        }else{
            await repo.insert(info)
            // console.log(`km ${kmInfo.id} added to the db`)
            return true
        }
    }
    async loadKmInfo(pages: number = 1, afterId: number | undefined = undefined){
        let KmInfos = await this.bulkReadKmInfo(pages, afterId);
        let newKmInfo:tKmInfo[] = [];
        for(let kminfo of KmInfos){
            let isNew = await this.checkAndInsertKmInfo(kminfo);
            if(isNew){
                newKmInfo.push(kminfo)
            }
        }
        console.log(`Load ${KmInfos.length} KMs from KB site, ${newKmInfo.length} new, ${KmInfos.length - newKmInfo.length} old`)
        return newKmInfo
    }
    async bulkReadKmInfo(pages: number = 1, afterId: number | undefined = undefined):Promise<tKmInfo[]> {
        let lastId: undefined | number = afterId
        let kminfos: tKmInfo[] = []
        while (pages--) {
            let kms = await this.readKBList(lastId);
            let lastKM = _.last(kms);
            kminfos = kminfos.concat(kms);

            if(lastKM){
                lastId = lastKM.id
            }else{
                console.log(`bulk read end with ${pages} page remain because of no new record found`)
                return kminfos
            }
            console.log(`${pages} pages to read`)
        }
        console.log(`read ${kminfos.length} kms after ${afterId}`)
        return kminfos
    }
    async readKBList(afterId?: number):Promise<tKmInfo[]> {
        let url = kbBaseURL;
        if (afterId) {
            url = `${kbBaseURL}/?next=${afterId}`
        }
        let response = await got(url);
        let document: any = parse5.parse(response.body)
        let kbtables = FindHTMLASTNode(document.childNodes, findkbtable);
        console.log(`Find ${kbtables.length} kbtables`);
        let kbtable = kbtables[0];
        let kbtableBody = FindHTMLASTNode(kbtable.childNodes, (node: any) => {
            return (node.tagName == 'tbody')
        })[0];
        let kbtableBodyTrs = FindHTMLASTNode(kbtableBody.childNodes, (node: any) => {
            return (node.tagName == 'tr')
        })
        let killIds: number[] = [];
        kbtableBodyTrs.forEach((tr) => {
            if (_.isArray(tr.attrs)) {
                for (let attr of tr.attrs) {
                    if (attr.name == 'id') {
                        let killId = _.replace(attr.value, 'kbtable_placeholder_', '')
                        try {
                            let tid = parseInt(killId)
                            if (tid)
                                killIds.push(tid);
                            return;
                        } catch (e) {
                            console.log(`killId process error ${format(e)}`)
                        }
                    }
                }
            }
            console.log(`Id missing from ${JSON.stringify(tr)}`);
        })
        let killInfos: tKmInfo[] = []
        for (let killId of killIds) {
            let hash = await this.readKillHash(killId.toString());
            if (hash) {
                killInfos.push({
                    id: killId,
                    hash: hash
                })
            }
        }
        console.log(`read ${killInfos.length} kms after ${afterId}`)
        return killInfos;
    }
    async readKillHash(killId: string): Promise<string | null> {
        let marketurl = `${kbBaseURL}/kill/${killId}/`
        let response = await got(marketurl);
        let document: any = parse5.parse(response.body)
        let killLinks: string[] = []
        FindHTMLASTNode(document.childNodes, (node: any) => {
            if (node.tagName && (node.tagName == "a")) {
                if (_.isArray(node.attrs)) {
                    for (let attr of node.attrs) {
                        if (attr.name == 'href') {
                            if (_.startsWith(attr.value, `${esiKillmailsApi}/${killId}/`)) {
                                killLinks.push(attr.value)
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        });
        if (killLinks.length == 1) {
            let link = _.replace(killLinks[0], `${esiKillmailsApi}/${killId}/`, '')
            let hash = _.replace(link, '/', '')
            console.log(`success read hash for kill ${killId} hash is ${hash}`)
            return hash;
        } else {
            console.log(`kill ${killId} killLinks length unexpected get ${killLinks.length}`)
        }
        return null
    }
}