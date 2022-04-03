import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export function reactive (raw) {
    return createActiveObject(raw, mutableHandlers);
}

export function readonly (raw) {
    return createActiveObject(raw, readonlyHandlers);
}

function createActiveObject (raw, baseHandler) {
    return new Proxy(raw, baseHandler)
}
