import { isObject } from "../reactivity/shared/index";
import { ShapeFlags } from "../reactivity/shared/ShapeFlage";
import { createComponentInstance, setupComponent } from "./component";

export function render (vnode: any, container: any) {
    patch(vnode, container);
}

function patch (vnode: any , container: any) {
    const { shapeFlags } = vnode;
    if (shapeFlags & ShapeFlags.ELEMENT) processElement(vnode, container);
    if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) processComponent(vnode, container);
}

function processElement (vnode: any, container: any) {
    mountElement(vnode, container);
}

function mountElement (vnode: any, container: any) {
    const el = vnode.el = document.createElement(vnode.type);
    const { children, shapeFlags } = vnode;

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) el.textContent = children;
    if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {        
        mountChildren(children, el);
    };
    const { props } = vnode;
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const val = props[key];
            el.setAttribute(key, val);
        }
    }

    container.append(el);
}

function mountChildren (children, container) {
    children.forEach((h) => {
        patch(h, container);
    })
}

function processComponent (vnode:any, container: any) {
    mountComponent(vnode, container);
}

function  mountComponent (initVNode: any, container: any) {
    const instance = createComponentInstance(initVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initVNode, container);
}

function setupRenderEffect (instance: any, initVNode: any, container: any) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    // element -> 全部挂载后将element的真实DOM指向到component的el上
    initVNode.el = subTree.el;
}
