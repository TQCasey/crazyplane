
import Enemy    from '../enemy/enemy'
import itemBase from '../cmm/ItemBase';

export default class enemyMgr extends itemBase {
    private static  instance: enemyMgr = null;

    static getInstance () {
        if (enemyMgr.instance == null) {
            enemyMgr.instance = new enemyMgr ('enemy');
        }

        return enemyMgr.instance;
    }

}