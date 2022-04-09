import { createVNode } from "./vnode";

export function renderSlots (slots, name, props) {
    const slot = slots[name];
    return (typeof slot === "function") && createVNode("div", {}, slot(props));
}