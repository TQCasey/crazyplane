import EventMgr from "../event/eventMgr";
import Utils from "../utils/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Prop extends cc.Component {

    undead : number = 0;
    power : number = 1;
    speed : number = 1;
    count : number = 1;
    name : string = "prop";

    @property(cc.AudioClip)
    deadSound : cc.AudioClip = null;

    @property(cc.SpriteAtlas)
    sprites : cc.SpriteAtlas = null;

    isUndead = false;

    @property(cc.Node)
    light : cc.Node = null;

    @property(cc.Node)
    bg : cc.Node = null;

    anim : cc.ActionInterval = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.startAnimation ();
    }

    start () {

    }

    isDead () {
        cc.audioEngine.play (this.deadSound,false,1);
        
        EventMgr.dispatch ('achieve_prop',this.getProps ())
        this.node.active = false;
    }

    setData (info) {
        info    = info || {};
        
        let typeMap = [
            ['A','A'],
            ['lobby_shuliang_WZDZK','lobby_shuliang02_WZDZK'],      // count  : c
            ['lobby_sudu_WZDZK','lobby_sudu02_WZDZK'],              // speed  : s
            ['lobby_weili_WZDZK','lobby_weili02_WZDZK'],            // power  : p
            ['lobby_wudi_WZDZK','lobby_wudi02_WZDZK'],              // undead : undead
        ]

        let t = Math.abs (info.v);
        let props = info.props || {};

        this.bg.getComponent (cc.Sprite).spriteFrame = this.sprites.getSpriteFrame (typeMap [t][0]);
        this.light.getComponent (cc.Sprite).spriteFrame = this.sprites.getSpriteFrame (typeMap [t][1]);

        // props
        this.power = parseInt (props.p) || 0;
        this.speed = parseInt (props.s) || 0;
        this.count = parseInt (props.c) || 0;
        this.undead = parseInt (props.w) || 0;
    }

    getProps () {
        return {
            power : this.power,
            speed : this.speed,
            count : this.count,
            undead : this.undead,
        }
    }

    setProps (tbl) {
        if (tbl) {
            if (tbl.power) {
                this.power = tbl.power;
            }

            if (tbl.speed) {
                this.speed = tbl.speed;
            }

            if (tbl.count) {
                this.count = tbl.count;
            }

            if (tbl.undead) {
                this.undead = tbl.undead;
            }
        }
    }

    reuse () {
        // alert ("AAA")
    }

    unreuse () {
        // alert ("BBB")
    }

    startAnimation () {
        this.anim = cc.repeatForever (
            cc.sequence (
                cc.scaleTo(0.8, 0.8),
                cc.scaleTo(0.8, 1),
            )
        )

        this.light.runAction(this.anim);
    }



    // update (dt) {}
}
