
import Bullet    from '../bullet/bullet'
import itemBase from '../cmm/ItemBase';

export default class bulletMgr extends itemBase {
    private static  instance: bulletMgr = null;

    static getInstance () {
        if (bulletMgr.instance == null) {
            bulletMgr.instance = new bulletMgr ('bullet');
        }

        return bulletMgr.instance;
    }
}