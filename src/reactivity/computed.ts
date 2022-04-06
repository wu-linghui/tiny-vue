import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
    _value: any;
    _dirty: boolean = true;
    _effect: any;
    constructor (getter) {
        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) this._dirty = true;
        })
    }

    get value () {
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
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