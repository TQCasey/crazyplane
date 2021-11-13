import bulletMgr from "./bulletMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    isPause : boolean = false;
    eventMap = {};
    power : number = 0;
    speed : number = 0;

    @property(cc.AudioClip)
    sound : cc.AudioClip = null;

    private userId : number = 0;
    private isMyPlane : boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setPower (value : number) {
        this.power = value;    
    }

    getPower () {
        return this.power;  
    }

    setSpeed (speed : number) {
        this.speed = speed;
    }

    setUserId (userId : number = 0 , isMyPlane : boolean = false) {
        this.userId = userId;
        this.isMyPlane = isMyPlane;
    }

    getUserId () : number {
        return this.userId;
    }

    isMyBullet () : boolean {
        return this.isMyPlane;
    }

    getSpeed () {
        return this.speed;
    }

    onOutOfScreen () {
        bulletMgr.getInstance ().put (this.node);
    }

    isHitted () {
        // console.log ("Bullet is hited");
        bulletMgr.getInstance ().put (this.node);
    }

    unuse () {
        this.isPause = true;
    }

    reuse () {
        this.isPause = false;
    }

    update (dt : number) {

        if (this.isPause) {
            return ;
        }

        this.node.y += this.speed;

        if (this.node.y > cc.winSize.height * 1.3) {
            this.isPause = true;
            this.onOutOfScreen && this.onOutOfScreen ();
        }
    }
}

