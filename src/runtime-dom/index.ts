import { createRender } from "../runtime-core";

function createElement (type) {
    return document.createElement(type);
}

function patchProp (el, key, prevVal, nextVal) {
    const isOnEvent = (key: string) => /^on[A-Z]/.test(key);
    if (isOnEvent(key)) {
        el.addEventListener(key.slice(2).toLowerCase(), nextVal);
    } else {
        if (nextVal === undefined || nextVal === null) return el.removeAttribute(key);
        el.setAttribute(key, nextVal);
    }
}

function insert (el, parent) {
    parent.append(el);
}

const render: any = createRender({
    createElement,
    patchProp,
    insert
});

export function createApp (...args) {
    return render.createApp(...args);
}


export * from "../runtime-core";