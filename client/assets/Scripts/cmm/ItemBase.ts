
export default class itemBase {
    
    private m_pool : cc.NodePool = null;
    private m_prefab : cc.Node = null;

    constructor (compname : string){
        this.m_pool = new cc.NodePool(compname);
    }

    public get (isActive : boolean = true,parent : cc.Node = null) : cc.Node {
        let node : cc.Node = null;

        if (true && this.m_pool.size () > 0) { 
            node = this.m_pool.get ();
        } else { 
            node = this.initInstance ();
        }

        node.active = isActive;
        node.parent = parent;

        return node;
    }

    public put (node : cc.Node) : boolean {
        let ret : boolean = false;
        if (node) {
            this.m_pool.put (node);
        }
        return ret;
    }

    public setPrefab (node : cc.Node,preCreateNum : number = 0) : void {
        this.m_prefab = node;

        for (let i : number = 0 ; i < preCreateNum ; i ++) {
            let node : cc.Node = this.initInstance ();
            this.put (node);
        }
    }

    private initInstance () : cc.Node {
        return cc.instantiate(this.m_prefab);
    }
}