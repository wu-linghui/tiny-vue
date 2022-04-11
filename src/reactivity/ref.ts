import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
import { hasChange, isObject } from "../shared";
import { ObjectFlags } from "../shared/enum";

class RefImpl {
    private _value: any;
    private _rawValue: any;
    public dep;
    public _v_isRef: boolean =  true;
    constructor (value) {
        convert(this, value);
        this.dep = new Set();
    }

    get value () {
        if (isTracking()) trackEffects(this.dep);
        return this._value;
    }

    set value (newValue) {
        if (!hasChange(newValue, this._rawValue)) return;
        convert(this, newValue);
        triggerEffects(this.dep);
    }
}

export function ref (value) {  
    return new RefImpl(value);
}

export function isRef (value) {
    return !!value[ObjectFlags.IS_REF];
}

export function unRef (ref) {
    return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRef) {
    return new Proxy(objectWithRef, {
        get (target, key) {
            /* get -> age(ref) 那么就给它返回.value
               不是ref -> value
             */
            return unRef(Reflect.get(target, key));
        },

        set (target, key, value) {
            /* set -> 被修改的值为ref则替换掉.value并且新值不能为ref类型 */
            if (isRef(target[key]) && !isRef(value)) return target[key].value = value;
            return Reflect.set(target, key, value);
        }
    })
}

function convert (_this, value) {
    _this._rawValue = value;
    _this._value = isObject(value) ? reactive(value) : value;
}