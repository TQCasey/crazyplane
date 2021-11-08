export default class Utils {

    private static instance : Utils = null;

    static getInstance () : Utils {
        if (Utils.instance == null) {
            Utils.instance = new Utils ();
        }

        return Utils.instance;
    }

    public SerializeMoney (num : number,pric : number = 3,toInt : boolean = false) : string {
        let unit = [
            "K",
            "M",
            "B",
            "T",
        ];

        let unit_mul = [
            1000,
            1000000,
            1000000000,
            1000000000000,
        ];
        let unit_idx    = -1;

        let sign = "";
        if (num < 0) {
            sign = "-";
            num = -num;
        }

        let pnum:string = "";
        let _unit = "";

        if (num >= unit_mul [3]) {
            pnum = (num / unit_mul [3]).toString ();
            pnum = pnum.substring(0,pnum.indexOf(".") + (pric + 1));
            _unit = unit[3];
            unit_idx = 3;
        } else if (num >= unit_mul [2]) {
            pnum = (num / unit_mul [2]).toString ();
            pnum = pnum.substring(0,pnum.indexOf(".") + (pric + 1));
            _unit = unit[2];
            unit_idx = 2;
        } else if (num >= unit_mul [1]) {
            pnum = (num / unit_mul [1]).toString ();
            pnum = pnum.substring(0,pnum.indexOf(".") + (pric + 1));
            _unit = unit[1];
            unit_idx = 1;
        } else if (num >= unit_mul [0]) {
            pnum = (num / unit_mul [0]).toString ();
            pnum = pnum.substring(0,pnum.indexOf(".") + (pric + 1));
            _unit = unit[0];
            unit_idx = 0;
        } else {
            pnum = num.toString ();
        }

        pnum = pnum.toString();

        if (pnum.indexOf('.') >= 0) {
            for (let i = pnum.length - 1; i >= 0; i--) {
                if ((pnum.charAt(i) == '0') && (pnum.charAt(i - 1) != '.')) {
                    //i--;
                }
                else {
                    if ((pnum.charAt(i-1) == '.') && (pnum.charAt(i) == '0')) i-=2;
                    pnum = pnum.substring(0, i + 1);
                    break;                    
                }
            }            
        }

        // if (pnum.indexOf('.') >= 0) {
        //     for (let i = pnum.length - 1; i >= 0; i--) {
        //         if ('0'.indexOf(pnum.charAt(i)) === -1) {
        //             if ('.'.indexOf(pnum.charAt(i - 1)) === -1) {
        //                 i--;
        //             }
        //             pnum = pnum.substring(0, i + 1);
        //             break;
        //         }
        //     }            
        // }

        if (toInt) {
            return ((sign == "-" ? -1 : 1) * unit_mul [unit_idx] * (parseInt (pnum) || 0)).toString ();
        }

        return sign + pnum + _unit;
    }

    public makeEvent (name : string,data : any = null,bubble : boolean = true) {
        let e : cc.Event.EventCustom = new cc.Event.EventCustom(name, bubble);
        e.detail = data;
        return e;
    }

    
}