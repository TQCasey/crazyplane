/* 
 * event map that for custom local client used 
 * 2018/8/31 casey 
 */

class EventMgrClass {

    // handlers: null,

    private handlers : any = [];

    private isValid (node : cc.Node) : boolean {
        return cc.isValid (node,true);
    }

    private Log (...args) : void {
        console.log (...args);
    }

    private safecall (callback) : void {
        try {
            callback && callback ();
        } catch (e) {

        }
    }

    // send event (sync)
    // ONLY responded by the first (just ONE) registed handler 
    public send (event : string, param : any = null) : boolean {

        let self : EventMgrClass = this;

        if (event && self.handlers[event]) {
            for (let i in self.handlers[event]) {
                if (self.handlers[event][i]) {
                    // self.Log ("dispatch event " + event.toString());
                    let info = self.handlers[event][i];
                    if (info && (this.isValid (info.obj) || info.obj == 0) && info.callback) {

                        let ret : boolean = false;
                        self.safecall (() => {
                            ret = info.callback(param, info.obj);
                            if (info.auto) {
                                // auto release 
                                self.removeListener(info.callback);
                            }
                        })
                        // swallow event 
                        return ret; // result that brought from responder 
                    }

                    if (info.obj && !this.isValid (info.obj) && self.handlers[event] && self.handlers[event] [i]) {
                        delete self.handlers[event][i];
                    }
                }
            }
        }
        return false; // nothing can be retrived 
    }

    // dispatch event with param (async)
    public dispatch (event : string, param : any = null) : boolean {

        let self : EventMgrClass = this;

        if (event && self.handlers[event]) {
            for (let i in self.handlers[event]) {
                if (self.handlers[event][i]) {
                    // self.Log ("dispatch event " + event.toString());
                    let info = self.handlers[event][i];
                    if (info && (self.isValid(info.obj) || info.obj == 0) && info.callback) {
                        let ret = false;
                        self.safecall (() => {
                            ret = info.callback(param, info.obj);
                            if (info.auto) {
                                // auto release 
                                self.removeListener(info.callback);
                                return ret;
                            }
                        });

                        if (ret) {
                            // return true , swallow the event 
                            // orelse pass through 
                            return true;
                        }
                    }

                    if (info.obj && !this.isValid (info.obj) && self.handlers[event] && self.handlers[event] [i]) {
                        delete self.handlers[event][i];
                    }
                }
            }
        }
        // has Handler ,but not swallow ==> no handler 
        return false;
    }

    // private call (stupid !!!)
    private getCallback (callback : Function) : any{
        
        let self : EventMgrClass = this;

        for (let event in self.handlers) {
            let callbacks = self.handlers[event];
            for (let i in callbacks) {
                if (callbacks[i] && callbacks[i].callback === callback) {
                    return {
                        evt: event,
                        i: i,
                    }
                }
            }
        }
        return null;
    }

    // register event  
    public register (event : string, callback : Function, obj : cc.Node = null, auto : boolean = false) {

        let self : EventMgrClass = this;

        if (event && callback && (this.isValid (obj) || obj == null)) {
            self.handlers[event] = self.handlers[event] || [];
            callback.bind(obj);
            self.handlers[event].push({
                callback: callback,
                obj: obj,
                auto: auto,
            });
        }
    }

    public registerOnce (event : string, callback : Function, obj : cc.Node) {
        
        let self : EventMgrClass = this;

        this.register(event, callback, obj, true);
    }

    public registerWithoutObj (event : string, callback : Function, auto : boolean = false) {
        
        let self : EventMgrClass = this;

        this.register(event, callback, null, auto);
    }

    public registerWithoutObjOnce (event : string, callback : Function) : void {
        
        let self : EventMgrClass = this;

        this.register(event, callback, null, true);
    }

    // unregister event (all callbacks will be removed)
    public unregister (event : string) {
        
        let self : EventMgrClass = this;

        if (event) {
            self.handlers[event] = null;
            delete self.handlers[event];
        }
    }

    // remove a callback 
    public removeListener (callback : Function) {
        
        let self : EventMgrClass = this;

        if (callback) {
            let info : any = self.getCallback(callback);
            if (info && info.evt && info.i && info.i >= 0) {
                self.handlers[info.evt].splice(info.i, 1); // slow

                // if no handlers any more 
                // remove whole event 
                if (self.handlers[info.evt].length <= 0) {
                    this.unregister(info.evt);
                }
            }
        }
    }
    // reset events
    public reset () {
        let self : EventMgrClass = this;
        self.handlers = [];
    }

    public dumpEvent (event : any) {

        let self : EventMgrClass = this;

        if (event) {
            console.log (self.handlers[event]);
        }
    }
};

var EventMgr = new EventMgrClass();
export default EventMgr;