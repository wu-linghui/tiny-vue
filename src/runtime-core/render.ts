import { ShapeFlags } from "../shared/ShapeFlage";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render (vnode: any, container: any) {
    patch(vnode, container);
}

function patch (vnode: any , container: any) {
    const { shapeFlags, type } = vnode;

    /* 根据type来调用不同的函数处理不同的虚拟DOM节点 */
    switch (type) {
        case Fragment:
            processFragment(vnode.children, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlags & ShapeFlags.ELEMENT) processElement(vnode, container);
            if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) processComponent(vnode, container);
            break;
    }
}

function processElement (vnode: any, container: any) {
    mountElement(vnode, container);
}

function processFragment (vnode: any, container: any) {
    mountChildren(vnode, container);
}

function processText (vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}

function mountElement (vnode: any, container: any) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, shapeFlags } = vnode;

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) el.textContent = children;
    if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {        
        mountChildren(children, el);
    };
    const { props } = vnode;
    for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const val = props[key];
            const isOnEvent = (key: string) => /^on[A-Z]/.test(key);
            isOnEvent(key) ? el.addEventListener(key.slice(2).toLowerCase(), val)
            : el.setAttribute(key, val);            
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
