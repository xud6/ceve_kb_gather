import _ from 'lodash'

export function FindHTMLASTNode(nodes: any[], predicate: (o: any) => boolean): any[] {
    let result: any[] = []
    for (let node of nodes) {
        if (predicate(node)) {
            result.push(node);
        } else {
            if (_.isArray(node.childNodes)) {
                let r = FindHTMLASTNode(node.childNodes, predicate);
                if (r.length > 0) {
                    result = result.concat(r);
                }
            }
        }
    }
    return result;
}
