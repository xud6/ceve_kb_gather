import got from 'got'
import parse5 from 'parse5'
import _ from 'lodash'
import { FindHTMLASTNode } from './HTMLAST';
import { format } from 'util';

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

interface killInfo {
    id: string,
    hash: string
}

export class KMGather {
    constructor() {

    }
    async readKBList(afterId?: number) {
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
        let killIds: string[] = [];
        kbtableBodyTrs.forEach((tr) => {
            if (_.isArray(tr.attrs)) {
                for (let attr of tr.attrs) {
                    if (attr.name == 'id') {
                        let killId = _.replace(attr.value, 'kbtable_placeholder_', '')
                        try {
                            if (parseInt(killId))
                                killIds.push(killId);
                            return;
                        } catch (e) {
                            console.log(`killId process error ${format(e)}`)
                        }
                    }
                }
            }
            console.log(`Id missing from ${JSON.stringify(tr)}`);
        })
        let killInfos:killInfo[] = []
        for (let killId of killIds) {
            let hash = await this.readKillHash(killId);
            if (hash) {
                killInfos.push({
                    id:killId,
                    hash:hash
                })
            }
        }
        console.log(killInfos);
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
            let hash = _.replace(link, '/')
            console.log(`success read hash for kill ${killId}`)
            return hash;
        } else {
            console.log(`kill ${killId} killLinks length unexpected get ${killLinks.length}`)
        }
        return null
    }
}