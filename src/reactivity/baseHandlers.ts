import { track, trigger } from "./effect";
import { ObjectFlags } from "./shared/enum";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter (isReadonly = false) {
    return function get (target, key) {
        if (key == ObjectFlags.IS_REACTIVE) return !isReadonly;
        if (key == ObjectFlags.IS_READONLY) return isReadonly;
        const res = Reflect.get(target, key);
        if (!isReadonly) track(target, key);
        return res;
    }
}

function createSetter () {
    return function set (target, key, val) {
        const res = Reflect.set(target, key, val);
        trigger(target, key);
        return res;
    }
}

export const mutableHandlers = {
    get: get,
    set: set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set (target, key, val) {
        console.warn("warn");
        return true;
    }
}


