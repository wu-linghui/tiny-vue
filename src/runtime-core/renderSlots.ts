import { createVNode, Fragment } from "./vnode";

export function renderSlots (slots, name, props) {
    const slot = slots[name];
    return (typeof slot === "function") && createVNode(Fragment, {}, slot(props));
}