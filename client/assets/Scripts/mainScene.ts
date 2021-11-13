
const {ccclass, property} = cc._decorator;

import EventMgr from './event/eventMgr';

import mapdata from './map/mapInfo'
import Prop     from './prop/prop'
import Plane    from './plane/plane'
import Enemy    from './enemy/enemy'
import endDlg   from './ui/endDlg'

import enemyMgr from './enemy/enemyMgr';
import planeMgr from './plane/planeMgr';
import bulletMgr from './bullet/bulletMgr';
import propMgr from './prop/propMgr';
import Utils from './utils/Utils';

@ccclass
export default class mainScene extends cc.Component {

    myPlane : cc.Node = null;

    @property(cc.Node)
    PlanePrefab : cc.Node = null;

    @property(cc.Node)
    EnemyPrefab : cc.Node = null;

    @property(cc.Node)
    PropPrefab : cc.Node = null;

    @property(cc.Node)
    BulletPrefab : cc.Node = null;

    @property(cc.Integer)
    blockSpeed : Number = 2;

    @property(cc.Node)
    operatePanel : cc.Node = null;

    @property(cc.Label)
    scoreLabel : cc.Label = null;

    @property(cc.Node)
    startNode : cc.Node = null;

    @property(cc.Node)
    pauseNode : cc.Node = null;

    @property(cc.Node)
    rankNode : cc.Node = null;

    @property(cc.Node)
    endNode : cc.Node = null;

    @property(cc.Node)
    powerBar : cc.Node = null;

    @property(cc.Node)
    speedBar : cc.Node = null;

    @property(cc.AudioClip)
    winSound : cc.AudioClip = null;

    @property(cc.AudioClip)
    loseSound : cc.AudioClip = null;

    @property(cc.AudioClip)
    bgm : cc.AudioClip = null;

    @property(cc.Label)
    toastTips : cc.Label = null;

    frameCount : number = 0;
    preCreateEnemyCount : number = 30;
    preCreatePropCount : number = 10;

    @property(cc.Label)
    powerLabel : cc.Label = null;

    @property(cc.Label)
    speedLabel : cc.Label = null;

    lineData = [] ;
    lineIndex : number = 0;

    curPower : number = 0;
    curSpeed : number = 0;
    curCount : number = 0;

    isPaused : Boolean = false;

    zoomAni : cc.ActionInterval = null;
    toastTipsAni : cc.ActionInterval = null;

    @property(cc.Boolean)
    debugBox : boolean = false;

    ColyseusClient = null;

    constructor() {
        super ();
    }
    
    // LIFE-CYCLE CALLBACKS:

    showContentByName (name : String,showPlane : boolean = true) {
        this.operatePanel.active = 'operate' == name;
        this.startNode.active  = 'start' == name;

        this.pauseNode.active   = 'pause' == name;
        this.rankNode.active    = 'rank' == name;
        this.endNode.active     = 'end' == name;

        // plane
        if (this.myPlane) {
            this.myPlane.active = showPlane;
        }

        this.isPaused = 'operate' != name;
    }

    puToPool (node : any) {
        let name = node.name;
        if (name == 'prop') {
            planeMgr.getInstance ().put (node);
        } else if (name == 'enemy') {
            enemyMgr.getInstance ().put (node);
        }
    }

    removeAllNodes () {
        for (let i = 0 ; i < this.lineData.length  ; i ++) {
            let LineData = this.lineData [i];
            for (let i = 0 ; i < LineData.length ; i ++) {
                this.puToPool (LineData [i]);
            }
        }

        this.lineData = [];
    }

    startGame () {
        
        this.myPlane = planeMgr.getInstance ().get (true,this.node);
        this.myPlane.zIndex = 1000;

        this.showContentByName ('operate');
        
        this.myPlane.x = 0;
        this.myPlane.y = -300;
        this.lineIndex = 0;
        this.removeAllNodes ();

        this.scoreLabel.string = "0";

        EventMgr.dispatch ("start_game");
    }

    onButtonClicked () : void {
        EventMgr.dispatch ("start_game");
    }
    
    pauseGame () {
        this.showContentByName ('pause')
    }

    endGame () {
        cc.audioEngine.play (this.loseSound,false,1);
        this.showContentByName ('end');

        let endDlgScript : endDlg = this.endNode.getComponent ('endDlg');
        if (endDlgScript) {
            endDlgScript.setScore (parseInt (this.scoreLabel.string) || 0,false);
        }

        planeMgr.getInstance ().put (this.myPlane);

        this.myPlane = null;

    }

    onLoad () {

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = this.debugBox;

        // init model 
        this.EnemyPrefab.width = cc.winSize.width / 5;
        this.EnemyPrefab.getComponent (cc.Collider).node.width = cc.winSize.width / 5;

        planeMgr.getInstance ().setPrefab (this.PlanePrefab,1);
        enemyMgr.getInstance ().setPrefab (this.EnemyPrefab,this.preCreateEnemyCount);
        bulletMgr.getInstance ().setPrefab (this.BulletPrefab,500);
        propMgr.getInstance ().setPrefab (this.PropPrefab,this.preCreatePropCount);

        EventMgr.register  ('achieve_prop',this.onAchieveProp.bind(this),this.node);
        EventMgr.register  ('plane_dead',this.onPlaneDead.bind (this),this.node);
        EventMgr.register  ('bullet_hit',this.onBulletHit.bind (this),this.node);
        

        // let bgNode = this.Enemy.getChildByName ('bg');
        // bgNode.width = cc.winSize.width / 5;
        // bgNode.setContentSize (cc.size (cc.winSize.width / 5,bgNode.height))

        // this.Prop.width = cc.winSize.width / 5;

        this.scoreLabel.node.zIndex = 1000;
        this.endNode.zIndex = 10000;
        this.speedBar.zIndex = 10000;
        this.powerBar.zIndex = 10000;

        // cc.audioEngine.play (this.bgm,true,1);

        // this.powerLabel = this.powerBar.getChildByName ("label").getComponent (cc.Label);
        // this.speedLabel = this.speedBar.getChildByName ("label").getComponent (cc.Label);

        this.speedLabel.string = "速度 : " + 0 + "";
        this.powerLabel.string = "威力 : " + 0 + "";

        this.showContentByName ('start')
    }

    start () {

    }

    onAchieveProp (props : Prop) {

        // // props added 
        this.incSpeed (props.speed);
        this.incPower (props.power);
        this.incCount (props.count);
        this.incUndead (props.undead);
    }

    onPlaneDead ()  {
        this.isPaused = true;

        setTimeout (() => {
            this.endGame ();
        },1000);
    }

    onBulletHit (score : number) {
        this.incScrore (score);
    }

    onBanlanceDlgHomeClicked () {
        this.showContentByName ('start')
    }

    onBanlanceDlgRetryClicked () {
        this.startGame ();
    }

    onStartDlgRankClicked () {
        // this.mutexShow ('rank')
        this.rankNode.active    = true;
        this.rankNode.zIndex    = 1000000;
    }

    onStartDlgShareClicked () {
        this.showContentByName ('start')
    }

    incScrore (value : number) {

        // stopAction

        this.scoreLabel.node.stopAction (this.zoomAni);
        this.scoreLabel.node.scale = 1;

        this.zoomAni = cc.sequence (
            cc.scaleTo (0.1,1.35),
            cc.scaleTo (0.1,1),
            cc.scaleTo (0.1,1.35),
            cc.scaleTo (0.1,1),
        );

        this.scoreLabel.node.runAction (this.zoomAni);

        let oldScore : number = parseInt (this.scoreLabel.string) || 0;
        let newScore : number = oldScore + value;
        this.scoreLabel.string = newScore + "";

    }

    showToastWithAni (msg : string) {
        this.toastTips.string = msg
        this.toastTips.node.active = true;

        this.toastTips.node.y = -100;
        
        this.toastTips.node.stopAction (this.toastTipsAni);
        
        this.toastTipsAni = cc.sequence (
            cc.moveTo (0.35,0,100),
            cc.delayTime (0.35),
            cc.callFunc (() => {
                this.toastTips.node.active = false;
            })
        )

        this.toastTips.node.runAction (this.toastTipsAni)
    }

    incSpeed (value : number) {
        if (value <= 0) {
            return ;
        }
        
        this.showToastWithAni ("速度 + " + value);

        let oldValue : number = this.curSpeed;
        let newValue : number = oldValue + value;
        this.curSpeed = newValue;
        this.speedLabel.string = "速度 : " + newValue + "";
    }

    incPower (value : number) {
        if (value <= 0) {
            return ;
        }

        this.showToastWithAni ("威力 + " + value);

        let oldValue = this.curPower;
        let newValue = oldValue + value;
        this.curPower = newValue;
        this.powerLabel.string = "威力 : " + newValue + "";
    }

    incCount (value : number) {
        if (value <= 0) {
            return ;
        }

        this.showToastWithAni ("弹道 + " + value);
    }

    incUndead (value : number) {
        if (value <= 0) {
            return ;
        }

        this.showToastWithAni ("无敌时间 + " + value + "秒");
    }

    produceEnemy (curx : number,cury : number,data : any) {
        let node  : cc.Node = enemyMgr.getInstance ().get (true,this.operatePanel);

        let enemyScript : Enemy = node.getComponent (Enemy);
        if (enemyScript) {
            enemyScript.setInitLife (data);
        }

        node.x = curx;
        node.y = cury;

        return node;
    }

    produceProp (curx : number,cury : number,data : any) {
        let node : cc.Node = propMgr.getInstance ().get (true,this.operatePanel);

        let propScript : Prop = node.getComponent ('prop');
        if (propScript) {
            propScript.setData (data);
        }

        node.x = curx;
        node.y = cury;

        return node;
    }

    produceEnemys () {

        let lineInfo = mapdata [this.lineIndex] || {data : []};
        let lineData = lineInfo.data || [];
        let newSpeed : number = lineInfo.speed;

        if (newSpeed) {
            // change new Speed 
            this.blockSpeed = newSpeed;
        }

        let lineLen : number  = this.lineData.length;
        let curx : number = -cc.winSize.width / 2 + this.EnemyPrefab.width / 2;
        let cury : number = 0;
        let nodes = [];

        if (lineLen > 0) {
            let lastNode  = this.lineData [lineLen - 1] [0];
            cury = lastNode.y + this.EnemyPrefab.height;
        } else {
            cury = cc.winSize.height / 2;
        }

        for (let i = 0 ; i < lineData.length ; i ++) {

            if (!lineData [i]) {
                continue;
            }

            if (lineData [i].v == 0) {
                nodes.push ({y : cury,x : curx});
            } else if (lineData [i].v < 0) {
                let prop = this.produceProp (curx,cury,lineData [i]);
                nodes.push (prop);
            } else {
                let enemy = this.produceEnemy (curx,cury,lineData [i]);
                nodes.push (enemy);
            }

            curx += this.EnemyPrefab.width;
        }
        
        if (nodes.length > 0) {
            this.lineData.push (nodes);
        }

        this.lineIndex ++;
        if (this.lineIndex > mapdata.length) {
            this.lineIndex = 0;
        }
    }

    moveAllNode () {

        for (let i = 0 ; i < this.lineData.length ; i ++) {
            let lineNodes = this.lineData [i];
            for (let j = 0 ; j < lineNodes.length ; j ++) {
                let node = lineNodes [j];
                if (node) {
                    node.y -= this.blockSpeed.valueOf ();
                }
            }
        }

        let lineLen  = this.lineData.length;
        if (lineLen > 0) {
            let firstNode  = this.lineData [0][0];
            let lastNode  = this.lineData [lineLen - 1] [0];

            let firstNodeY = firstNode.y;
            let lastNodeY  = lastNode.y;

            if (firstNodeY < -cc.winSize.height / 2 - 100) {
                let firstLineData = this.lineData [0];
                for (let i = 0 ; i < firstLineData.length ; i ++) {
                    // recycle 
                    this.puToPool (firstLineData [i]);
                }
                this.lineData.splice(0, 1);
            }

            return Math.abs (firstNodeY - lastNodeY);
        } 
        return 0;
    }

    update (dt : number) {
        if (this.isPaused) {
            return ;
        }
        this.frameCount ++;
        let distance = this.moveAllNode ();
        if (distance < cc.winSize.height + 100) {
            this.produceEnemys ();
        }
    }

}
