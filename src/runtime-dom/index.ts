import { createRender } from "../runtime-core";

function createElement (type) {
    return document.createElement(type);
}

function patchProp (el, key, val) {
    const isOnEvent = (key: string) => /^on[A-Z]/.test(key);
    isOnEvent(key) ? el.addEventListener(key.slice(2).toLowerCase(), val)
    : el.setAttribute(key, val);
}

function insert (el, parent) {
    parent.append(el);
}

const render = createRender({
    createElement,
    patchProp,
    insert
});

export function createApp (...args) {
    return render.createApp(...args);
}


export * from "../runtime-core";