
const {ccclass, property} = cc._decorator;

@ccclass
export default class endDlg extends cc.Component {

    @property(cc.Node)
    new_rec : cc.Node = null;

    @property(cc.Label)
    score : cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setScore (score : number,isNewRec : boolean) {
        this.score.string = score + "";
        this.new_rec.active = !!isNewRec;
    }

    // update (dt) {}
}
