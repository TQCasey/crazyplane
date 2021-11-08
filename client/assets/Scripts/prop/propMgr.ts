
import Prop    from '../prop/prop'
import itemBase from '../cmm/ItemBase';

export default class propMgr extends itemBase {
    private static  instance: propMgr = null;

    static getInstance () {
        if (propMgr.instance == null) {
            propMgr.instance = new propMgr ('prop');
        }

        return propMgr.instance;
    }

}