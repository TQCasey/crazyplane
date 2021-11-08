
import Plane    from '../plane/plane'
import itemBase from '../cmm/ItemBase';

export default class planeMgr extends itemBase {
    private static  instance: planeMgr = null;

    static getInstance () {
        if (planeMgr.instance == null) {
            planeMgr.instance = new planeMgr ('plane');
        }

        return planeMgr.instance;
    }
}