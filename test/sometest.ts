import { expect } from 'chai';
import 'mocha';

import {template_error} from '../src/index';

let te = new template_error('a');

describe('template_error test',()=>{
    it('should be a sub class of error',()=>{
        expect(te).is.instanceof(Error);
    })
})