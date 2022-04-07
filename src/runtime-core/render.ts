import { isObject } from "../reactivity/shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render (vnode: any, container: any) {
    patch(vnode, container);
}

function patch (vnode: any , container: any) {
    if (typeof vnode.type === "string") processElement(vnode, container);
    if (isObject(vnode.type)) processComponent(vnode, container);
}

function processElement (vnode: any, container: any) {
    mountElement(vnode, container);
}

function mountElement (vnode: any, container: any) {
    const el = document.createElement(vnode.type);
    const { children } = vnode;

    if (typeof children === "string") el.textContent = children;
    if (Array.isArray(children)) {
        children.forEach((h) => {
            patch(h, el);
        })
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

function mountChildren () {

}

function processComponent (vnode:any, container: any) {
    mountComponent(vnode, container);
}

function  mountComponent (vnode: any, container: any) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}

function setupRenderEffect (instance: any, container: any) {
    const subTree = instance.render();
    patch(subTree, container);
}
