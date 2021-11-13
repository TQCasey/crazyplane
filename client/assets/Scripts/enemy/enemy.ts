
import Utils from '../utils//Utils'
import Bullet from '../bullet/bullet'
import Plane from '../plane/plane'
import EventMgr from '../event/eventMgr';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    name = "enemy";

    @property(cc.Label)
    life : cc.Label = null;

    @property(cc.Node)
    star : cc.Node = null;

    @property(cc.Node)
    bg : cc.Node = null;

    @property(cc.Node)
    bzha : cc.Node = null;

    @property(cc.Node)
    deadAni : cc.Node = null;

    @property(cc.AudioClip)
    deadSound : cc.AudioClip = null;

    @property(cc.SpriteAtlas)
    sprites : cc.SpriteAtlas = null;

    lifeValue: number = 0;

    // LIFE-CYCLE CALLBACKS:

    setInitLife (info) {
        let value = parseInt (info.v) || 0;
        let color = info.c || 0;

        if (value < 0) {
            value = 0;
        }

        this.lifeValue = value;
        this.life.string = Utils.getInstance ().SerializeMoney (value,2) + "";   

        let picTab = [
            'lobby_FKgreen_WZDZK',
            'lobby_FKorange_WZDZK',
            'lobby_FKpurple_WZDZK',
            'lobby_FKred_WZDZK',
            'lobby_FKyellow_WZDZK',
        ]

        this.bg.getComponent (cc.Sprite).spriteFrame = this.sprites.getSpriteFrame (picTab [color]);
    }

    isDead () {

        this.bg.active = false;
        this.deadAni.active = true;

        let EnemyBox  = this.getComponent (cc.Collider);
        EnemyBox.enabled = false;

        this.life.node.active = false;

        cc.audioEngine.play (this.deadSound,false,1);

        
    }

    reuse () {
        this.bg.active = true;
        this.deadAni.active = false;

        let EnemyBox  = this.getComponent (cc.Collider);
        EnemyBox.enabled = true;

        this.life.node.active = true;  
        this.life.string = "0";

        this.bzha.active = false;

        let part : cc.ParticleSystem = this.bzha.getComponent (cc.ParticleSystem);
        part.resetSystem ();
    }

    unreuse () {
        this.bg.active = false;
        this.deadAni.active = false;

        let EnemyBox  = this.getComponent (cc.Collider);
        EnemyBox.enabled = false;

        this.life.node.active = false;
    }

    decLife (value : number) {

        let oldValue = this.lifeValue;
        let nowValue = oldValue - value;
        this.lifeValue = nowValue;

        if (nowValue <= 0) {
            nowValue = 0;
            this.lifeValue  = 0;
            this.isDead ();
        }

        this.life.string = Utils.getInstance ().SerializeMoney (nowValue,2) + ""; 
        
        let size = this.node.getContentSize ();
        let x = (Math.random () - 0.5) * (size.width - 40) ;
        let y = (Math.random () - 0.5) * (size.height - 40);

        this.star.active = true;
        this.star.x = x;
        this.star.y = y;

        let star = this.star;

        star.getComponent (cc.Component).scheduleOnce(function() {
            star.active = false;
        }, 0.3);
        
    }

    onCollisionEnter (other : any,self : any) {
        let bullet : Bullet = other.node.getComponent ('bullet');
        if (bullet) {

            let power = bullet.getPower ();
            this.decLife (power);
            bullet.isHitted ();

            if (bullet.isMyBullet ()) {
                EventMgr.dispatch ('hit_enemy',power);
            }

        } else {
            let plane : Plane = other.node.getComponent ('plane');
            if (plane) {
                plane.isDead ();
            }
        }
    }

    onCollisionStay (other,self) {
        // console.log('on collision stay');
    }

    onCollisionExit (other,self) {
        // console.log('on collision exit');
    }

    // onLoad () {}

    start () {
        
    }

    // update (dt) {}
}

