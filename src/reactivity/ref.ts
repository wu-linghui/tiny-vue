import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
import { hasChange, isObject } from "./shared";

class RefImpl {
    private _value: any;
    private _rawValue: any;
    public dep;
    constructor (value) {
        this.dep = new Set();
        convert(this, value);
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

function convert (_this, value) {
    _this._rawValue = value;
    _this._value = isObject(value) ? reactive(value) : value;
}