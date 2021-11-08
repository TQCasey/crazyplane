
const {ccclass, property} = cc._decorator;

@ccclass
export default class rankDlg extends cc.Component {

    @property(cc.ScrollView)
    list : cc.ScrollView = null;

    @property(cc.Node)
    model : cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onCloseClicked () {
        this.node.active = false;
    }

    onLoad () {

    }

    start () {

    }

    // update (dt) {}
}
