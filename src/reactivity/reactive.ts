import { mutableHandlers, readonlyHandlers } from "./baseHandlers";
import { ObjectFlags } from "./shared/enum";

export function reactive (raw) {
    return createActiveObject(raw, mutableHandlers);
}

export function readonly (raw) {
    return createActiveObject(raw, readonlyHandlers);
}

function createActiveObject (raw, baseHandler) {
    return new Proxy(raw, baseHandler)
}


export function isReactive (value) {
    return !!value[ObjectFlags.IS_REACTIVE];
}

export function isReadonly (value) {
    return !!value[ObjectFlags.IS_READONLY];
}
