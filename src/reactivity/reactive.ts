import { mutableHandlers, readonlyHandlers, shallowHandlers } from "./baseHandlers";
import { ObjectFlags } from "../shared/enum";
import { isObject } from "../shared";

export function reactive (raw) {
    return createActiveObject(raw, mutableHandlers);
}

export function readonly (raw) {
    return createActiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowHandlers);
}

function createActiveObject (raw, baseHandler) {
    if (!isObject(raw)) {
        console.warn(`target ${raw} 必须是一个对象`);
        return raw;
    }
    return new Proxy(raw, baseHandler)
}


export function isReactive (value) {
    return !!value[ObjectFlags.IS_REACTIVE];
}

export function isReadonly (value) {
    return !!value[ObjectFlags.IS_READONLY];
}

export function isProxy (value) {
    return isReactive(value) || isReadonly(value);
}
