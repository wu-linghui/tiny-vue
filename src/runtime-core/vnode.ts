import { ShapeFlags } from "../shared/ShapeFlage";
export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export function createVNode (type, props?, children?) {
    const vnode = {
        type, 
        props,
        children,
        shapeFlags: getShapeFlage(type),
        el: null
    };
    // debugger;
    if (typeof children === "string") vnode.shapeFlags |= 4;
    if (Array.isArray(children)) vnode.shapeFlags |= 8;
    if ((vnode.shapeFlags & ShapeFlags.SLOT_CHILDREN) && (typeof children === "object")) {
        vnode.shapeFlags |= ShapeFlags.SLOT_CHILDREN;
    };
    return vnode;
}

export function createTextVNode (text: string) {
    return createVNode(Text, {}, text);
}

function getShapeFlage (type) {
    return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}