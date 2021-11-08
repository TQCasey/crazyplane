// /* 
//  * event map that for custom local client used 
//  * 2018/8/31 casey 
//  */

// export default class EventMgrClass {

//     // handlers: null,

//     private handlers : Array<string> = [];

//     // send event (sync)
//     // ONLY responded by the first (just ONE) registed handler 
//     public send (event : string, param : any) : void {
//         let self = this;

//         if (event && self.handlers[event]) {
//             for (let i in self.handlers[event]) {
//                 if (self.handlers[event][i]) {
//                     Log.v("dispatch event " + event.toString(16));
//                     let info = self.handlers[event][i];
//                     if (info && (Utils.notnull(info.obj) || info.obj == 0) && info.callback) {

//                         let ret = 0;

//                         if (AppConfig.DEBUG_EVENT_SOCKET) {

//                             ret = info.callback(param, info.obj);
//                             if (info.auto) {
//                                 // auto release 
//                                 self.removeListener(info.callback);
//                             }

//                         } else {

//                             AppConfig.safe_call(() => {
//                                 ret = info.callback(param, info.obj);
//                                 if (info.auto) {
//                                     // auto release 
//                                     self.removeListener(info.callback);
//                                 }
//                             });

//                         }

//                         // swallow event 
//                         return ret; // result that brought from responder 
//                     }

//                     if (info.obj && Utils.isnull(info.obj)) {
//                         delete self.handlers[event][i];
//                     }
//                 }
//             }
//         }
//         return null; // nothing can be retrived 
//     },
//     // dispatch event with param (async)
//     dispatch: function (event, param) {
//         let self = this;

//         if (event && self.handlers[event]) {
//             for (let i in self.handlers[event]) {
//                 if (self.handlers[event][i]) {
//                     Log.v("dispatch event " + event.toString(16));
//                     let info = self.handlers[event][i];
//                     if (info && (Utils.notnull(info.obj) || info.obj == 0) && Utils.isfunc(info.callback)) {

//                         let ret = 0;

//                         if (AppConfig.DEBUG_EVENT_SOCKET) {

//                             ret = info.callback(param, info.obj);
//                             if (info.auto) {
//                                 // auto release 
//                                 self.removeListener(info.callback);
//                             }

//                         } else {

//                             AppConfig.safe_call(() => {
//                                 ret = info.callback(param, info.obj);
//                                 if (info.auto) {
//                                     // auto release 
//                                     self.removeListener(info.callback);
//                                 }
//                             });

//                         }

//                         if (ret) {
//                             // return true , swallow the event 
//                             // orelse pass through 
//                             return true;
//                         }
//                     }

//                     if (info.obj && Utils.isnull(info.obj)) {
//                         delete self.handlers[event][i];
//                     }
//                 }
//             }
//         }

//         // has Handler ,but not swallow ==> no handler 
//         return false;
//     }

//     // private call (stupid !!!)
//     getCallback: function (callback) {
//         let self = this;
//         for (let event in self.handlers) {
//             let callbacks = self.handlers[event];
//             for (let i in callbacks) {
//                 if (callbacks[i] && callbacks[i].callback === callback) {
//                     return {
//                         evt: event,
//                         i: i,
//                     }
//                 }
//             }
//         }
//         return null;
//     },

//     // register event  
//     register: function (event, callback, obj, auto) {
//         let self = this;

//         if (event && callback && (Utils.notnull(obj) || obj == 0)) {
//             self.handlers[event] = self.handlers[event] || [];
//             callback.bind(obj);
//             self.handlers[event].push({
//                 callback: callback,
//                 obj: obj,
//                 auto: auto,
//             });
//         }
//     },
//     registerOnce: function (event, callback, obj) {
//         this.register(event, callback, obj, true);
//     },

//     registerWithoutObj: function (event, callback, auto) {
//         this.register(event, callback, 0, auto);
//     },
//     registerWithoutObjOnce: function (event, callback) {
//         this.register(event, callback, 0, true);
//     },
//     // unregister event (all callbacks will be removed)
//     unregister: function (event) {
//         let self = this;
//         if (event) {
//             self.handlers[event] = null;
//             delete self.handlers[event];
//         }
//     },
//     // remove a callback 
//     removeListener: function (callback) {
//         let self = this;
//         if (callback) {
//             let info = self.getCallback(callback);
//             if (info && info.evt && info.i && info.i >= 0) {
//                 self.handlers[info.evt].splice(info.i, 1); // slow

//                 // if no handlers any more 
//                 // remove whole event 
//                 if (self.handlers[info.evt].length <= 0) {
//                     this.unregister(info.evt);
//                 }
//             }
//         }
//     },
//     // reset events
//     reset: function () {
//         let self = this;
//         self.handlers = [];
//     },
//     dumpEvent: function (event) {

//             let self = this;

//             if (event) {
//                 Log.v(self.handlers[event]);
//             }
//     }
// };

// // var EventMgr = new EventMgrClass();
// // module.exports = EventMgr;