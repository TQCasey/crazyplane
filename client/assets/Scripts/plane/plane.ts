
const {ccclass, property} = cc._decorator;

import Prop from '../prop/prop'
import Bullet from '../bullet/bullet'
import Utils from '../utils/Utils';
import bulletMgr from '../bullet/bulletMgr';
import EventMgr from '../event/eventMgr';


@ccclass
export default class Plane extends cc.Component {

    name = "plane";

    @property(cc.Node)
    bullet : cc.Node = null;

    @property(cc.Node)
    bzha : cc.Node = null;

    @property(cc.Integer)
    gapOfBullet : number = 8;

    @property(cc.Node)
    shadow : cc.Node = null;

    @property(cc.Node)
    deadAni : cc.Node = null;

    @property(cc.Node)
    body : cc.Node = null;

    @property(cc.Node)
    guider : cc.Node = null;

    @property(cc.Node)
    fire_left : cc.Node = null;

    @property(cc.Node)
    fire_mid : cc.Node = null;

    @property(cc.Node)
    fire_right : cc.Node = null;

    @property(cc.AudioClip)
    shootSound : cc.AudioClip = null;

    @property(cc.AudioClip)
    deadSound : cc.AudioClip = null;

    @property(cc.AudioClip)
    achieve_sound : cc.AudioClip = null;

    private isPaused : boolean = false;
    private undead : number  = 0;
    private power : number = 1;
    private speed : number = 10;
    private count : number = 1;

    private userId : number = 0;
    private isMyPlane : boolean = false;

    private frameCount : number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onTouchStart (evt) {
        // console.log ("touch start ",evt);
    }

    onTouchMove (event : cc.Touch) {

        // console.log ("touch move ",event);
        if (!this.isMyPlane) {
            return ;
        }
        
        var pos_hero = this.node.getPosition();
        var pos_move = event.getDelta();

        var pos_end = cc.v2(pos_hero.x + pos_move.x, pos_hero.y + pos_move.y);
        let winSize = cc.winSize ;
        let planSize = {width : 0,height : 0};//this.node.getContentSize ();

        if (pos_end.x < -(winSize.width + planSize.width) / 2) {
            pos_end.x = -(winSize.width + planSize.width) / 2;
        } else if (pos_end.x > (winSize.width + planSize.width) / 2) {
            pos_end.x = (winSize.width + planSize.width) / 2;
        }
        if (pos_end.y < - (winSize.height + planSize.height) / 2) {
            pos_end.y = - (winSize.height + planSize.height) / 2;
        } else if (pos_end.y > (winSize.height + planSize.height) / 2) {
            pos_end.y = (winSize.height + planSize.height) / 2;
        }

        // console.log (pos_end);
        this.node.setPosition(pos_end);
    }

    onTouchEnd (evt) {
        // console.log ("touch ended ",evt);
    }

    installTouchEvents () {
        let node = this.node;
        node.on ('touchstart',this.onTouchStart,this);
        node.on ('touchmove',this.onTouchMove,this);
        node.on ('touchend',this.onTouchEnd,this);
    }

    uninstallTouchEvents () {
        let node = this.node;
        node.off ('touchstart',this.onTouchStart,this);
        node.off ('touchmove',this.onTouchMove,this);
        node.off ('touchend',this.onTouchEnd,this);
    }
    
    onLoad () {
        this.frameCount     = 0;
        this.shadow.zIndex = -1;
    }

    onEnable () {
        this.installTouchEvents ();
        EventMgr.register ('start_game',this.onStartGame.bind(this),this.node);
    }

    onDisable () {
        this.uninstallTouchEvents ();
    }

    onDestroy () {
        this.uninstallTouchEvents ();
    }

    start () {

    }

    setUserId (userId : number,isMyPlane : boolean = false) {
        this.userId = userId;
        this.isMyPlane = isMyPlane;
    }

    getUserId () : number {
        return this.userId;
    }

    onStartGame () {
        
        this.setCount (1);
        this.setPower (1);
        this.setSpeed (10);
        this.restart ();
    }

    setCount (count : number) {
        this.count = count;
    }

    incCount (count : number) {
        this.count += count;
    }

    setPower (power : number) {
        this.power = power;  
    }

    incPower (power : number) {
        this.power += power;  
    }

    setSpeed (speed : number) {
        this.speed = speed;
    }

    incSpeed (speed : number) {
        this.speed += speed;
    }

    setUndead (undead : number) {
        this.undead = undead;
    }

    incUndead (undead : number) {
        this.undead += undead;
    }

    onCollisionEnter (other,self) {

        // console.log('on collision enter');
        let prop : Prop = other.node.getComponent ('prop');
        if (prop) {

            let props = prop.getProps ();
            if (props) {
                this.incPower (props.power);
                this.incSpeed (props.speed);
                this.incCount (props.count);
                this.incUndead (props.undead);
            }
            prop.isDead ();
        }
    }

    onCollisionStay (other,self) {
        // console.log('on collision stay');
    }

    onCollisionExit (other,self) {
        // console.log('on collision exit');
    }

    shootBullet () {

        let count = this.count;

        if (count > 3) {
            count = 3;
        }

        if (count <= 0) {
            count = 1;
        }

        var pos = this.node.getPosition();
        var planeSize = this.node.getContentSize ();

        let map = [
            [
                cc.v2(pos.x,pos.y + this.node.height / 2 + 5),   
            ],
            [
                cc.v2(pos.x - planeSize.width / 2 + 10,pos.y + this.node.height / 2 + 5),
                cc.v2(pos.x + planeSize.width / 2 - 10,pos.y + this.node.height / 2 + 5),
            ],
            [
                cc.v2(pos.x - planeSize.width / 2 + 10,pos.y + this.node.height / 2 + 5),
                cc.v2(pos.x - 0,pos.y + this.node.height / 2 + 5),
                cc.v2(pos.x + planeSize.width / 2 - 10,pos.y + this.node.height / 2 + 5),
            ],
        ]

        let fires = [
            [
                this.fire_mid,
            ],
            [
                this.fire_left,
                this.fire_right,
            ],
            [
                this.fire_left,
                this.fire_mid,
                this.fire_right,
            ],
        ]

        this.fire_left.active = false;
        this.fire_mid.active = false;
        this.fire_right.active = false;

        let posTblP  = map [count - 1] || map [2];
        let fire     = fires [count - 1] || fires [2];

        for (let i = 0 ; i < count ; i ++) {

            let bullet = bulletMgr.getInstance ().get ();

            let script : Bullet = bullet.getComponent ('bullet');
            script.setPower (this.power);
            script.setSpeed (this.speed);
            script.setUserId (this.userId,this.isMyPlane);
    
            bullet.parent = this.node.parent
            bullet.active = true;
            
            bullet.setPosition(posTblP [i]);

            let fireObj = fire [i];
            fireObj.active = true;

            fireObj.getComponent (cc.Component).scheduleOnce(function() {
                fireObj.active = false;
                // console.log ("HelloWorld")
            }, 0.3);
        }

    }
    
    isDead () {
        
        this.isPaused = true;
        this.body.active = false;
        this.deadAni.active = true;

        cc.audioEngine.play (this.deadSound,false,1);
        this.node.active = false;

        if (!this.isMyPlane) {
            return ;
        }
        
        EventMgr.dispatch ('plane_dead');
    }

    reuse () {
        
        this.bzha.active = false;
        this.body.active = true;
        this.deadAni.active = false;
        this.isPaused = false;

        let part : cc.ParticleSystem = this.bzha.getComponent (cc.ParticleSystem);
        part.resetSystem ();
    }

    unreuse () {
        this.bzha.active = false;
    }

    restart () {
        this.isPaused = false;
        this.body.active = true;
        this.deadAni.active = false;
    }

    update (dt) {

        if (this.isPaused) {
            return ;
        }

        this.frameCount ++;
        if (this.frameCount % (this.gapOfBullet) == 0) {
            this.shootBullet ();
            cc.audioEngine.play (this.shootSound,false,1);
        }

    }

    // update (dt) {}
}
