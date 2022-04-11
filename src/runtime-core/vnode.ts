import { ShapeFlags } from "../shared/ShapeFlage";
export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");
export function createVNode (type, props?, children?) {
    const vnode = {
        type, 
        props,
        children,
        shapeFlag: getShapeFlage(type),
        el: null
    };
    // debugger;
    if (typeof children === "string") vnode.shapeFlag |= 4;
    if (Array.isArray(children)) vnode.shapeFlag |= 8;
    if ((vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) && (typeof children === "object")) {
        vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    };
    return vnode;
}

export function createTextVNode (text: string) {
    return createVNode(Text, {}, text);
}

function getShapeFlage (type) {
    return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}