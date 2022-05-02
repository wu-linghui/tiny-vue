import { createDep } from "./dep";
import { activeEffect, isTracking, ReactiveEffect, shouldTrack, trackEffects, triggerEffects } from "./effect";
import { toRaw } from "./reactive";

class ComputedRefImpl {
    _value: any;
    _dirty: boolean = true;
    _effect: any;
    public dep?: any
    // private _getter: any;
    constructor (getter) {
        // this._getter = getter;
        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
                triggerEffects(this.dep);
            }
        })
    }

    get value () {
        const self = toRaw(this);
        if (shouldTrack && activeEffect) {
            trackEffects(self.dep || (self.dep = createDep()));            
        }
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
            // this._value = this._getter();
        }
        return this._value;
    }

    // set value () {
        // return ";
    // }
}


export function computed (getter) {
    return new ComputedRefImpl(getter);
}